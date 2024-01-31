import glob, os, datetime, pathlib, re
from typing import List
from src import llm
from src.vector_store import VectorCollection, VectorDBItem
from config import AGREEMENTS_PATH


MAX_DECISIONS_TO_INCLUDE = 200 
MAX_PROMPT_TOKEN_COUNT = 20000 # main value to tweek
OUTPUT_DIR_BASE = 'tmp/llm_responses/' # we don't do directly to standard output dir to prevent overwriting
TOPICS_LIMIT = 3 # for dev, to prevent too many requests to OpenAI

output_dir = os.path.join(OUTPUT_DIR_BASE, datetime.datetime.now().strftime('%Y-%m-%d_%H-%M'))
os.makedirs(output_dir, exist_ok=True)


def readible_output(
    content: str,
    decisions: List[VectorDBItem])->str:
    # this function is a bit shaky, may need to be restructured when
    # changing the prompt

    # reindex the decisions: as we provide more decisions to the model than what it references in its response
    # we need to reindex the to only keep the relevant ones
#    references = util.extract_(response)

    # extract all the references from the content 
    references_full = re.findall(r'\[\d+\]', content)
    references_unique_ordered = list(dict.fromkeys(references_full))
    references_unique_ordered = [int(re.sub(r'\[|\]', '', item)) for item in references_unique_ordered]
    mapping = {old_index:new_index for new_index, old_index in enumerate(references_unique_ordered)}
    mapped_decisions = {}

    for old_index, new_index in mapping.items():
        mapped_decisions[new_index] = decisions[old_index]

    # replace the references in the content with the new references
    for old_index, new_index in mapping.items():
        #use -] to prevent replacing the new index on subsequent iterations
        content = content.replace(f"[{old_index}]", f"\[{new_index}-\]")
    content = content.replace("-\]", "\]")

    # append the refence list to the content ( assume a markdown format)
    content += '\n\n'
    content += '## Referenties (s3 files)\n\n'
    for index, decision in mapped_decisions.items():
        content += f"\[{index}\]: {decision.id}\n"

    content += '\n\n'
    content += '## Referenties (full text)\n\n'
    for index, decision in mapped_decisions.items():
        content += f"\[{index}\]: {decision.text}\n\n"


    return content


def save_response_structured(prompt:str,
                             response: str, 
                             decision_context: List[VectorDBItem], 
                             included_decision_count: int,
                             topic_name: str,
                             output_dir: str)->None:
    # TODO: be smarter in how have the referencing


    clean_topic_name = topic_name.replace('.txt', '')
    # create a directory for the topic
    topic_dir = os.path.join(output_dir, clean_topic_name)
    os.makedirs(topic_dir, exist_ok=True)

    # save metadata about the generation
    with open(f"{topic_dir}/metadata.txt", 'w') as f:
        f.write(f"MAX_PROMPT_TOKEN_COUNT: {MAX_PROMPT_TOKEN_COUNT}\n")
        f.write(f"MAX_DECISIONS_TO_INCLUDE: {MAX_DECISIONS_TO_INCLUDE}\n")
        f.write(f"DECISIONS_INCLUDED_IN_PROMPT: {included_decision_count}\n")
        f.write(f"TOPIC_NAME: {topic_name}\n")

    with open(f"{topic_dir}/raw_prompt_response.txt", 'w') as f:
        f.write(f"PROMPT:\n{prompt}\n\n")
        f.write('-------------------\n\n')
        f.write(f"RESPONSE:\n{response}\n\n")

    with open(f"{topic_dir}/clean_response.md", 'w') as f:
        f.write(readible_output(response, decision_context))


if __name__ == '__main__':

    decisions_collection = VectorCollection(name="decisions")
    topic_paths = glob.glob(AGREEMENTS_PATH + '*.txt')[:TOPICS_LIMIT]
    print(f"topic paths: {topic_paths}")

    for topic_file in topic_paths:
        topic_name = pathlib.Path(topic_file).stem
        print(f"topic: {topic_name}")
        with open(topic_file, 'r') as f:
            topic_text = f.read()
        topic_text = topic_text.replace('\n', ' ')

        matching_decisions = decisions_collection.similar_items(topic_text,
                                                                n_results=MAX_DECISIONS_TO_INCLUDE)

        prompt, included_decision_count = llm.generate_prompt_for_decision_consult(topic_text,
                                                                                matching_decisions,
                                                                                MAX_PROMPT_TOKEN_COUNT)
        print(f"tokens_in_prompt: {llm.token_count(prompt)}")
        print(f"# decisions included: {included_decision_count}")
        llm_response = llm.get_response(prompt)
        
        save_response_structured(prompt, llm_response, matching_decisions, included_decision_count, topic_name, output_dir)




