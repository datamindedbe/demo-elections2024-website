# create output folders and files in docusaurus
# run this script from project root directory
import os
import json
from string import digits
from src.util import get_secties_structure

LLM_RESPONSE_PATH = 'data/llm_responses/agreement_adherence/60k_token_context/'

def create_markdown(input_path, output_path):
    # this is the main function which creates the markdown files

    # get the content of the llm output file
    file_name  = input_path.split('/')[-1].rstrip('.txt')
    llm_path = LLM_RESPONSE_PATH + file_name + '/clean_responses.json'

    if not os.path.exists(llm_path):
        # we have not yet generated llm responses for all topics
        return
    
    with open(llm_path, 'r') as f:
        llm_data = json.load(f)

    with open(input_path, 'r') as f:
        section_content = f.read()

    output_path = output_path.replace('.txt', '')
    with open(output_path + '.md', 'w') as f:
        f.write(llm_data['heading'] + '\n\n')

        f.write(f"""<details>
        <summary>Regeerakkoord Sectie </summary>
        <p>{section_content}</p>
        </details> \n\n""")

        f.write(llm_data['body'] + '\n\n')

        reference_markdown = ''
        references = llm_data['references']
        keys_sorted = sorted(references.keys(), key=lambda x: int(x))
        for key in keys_sorted:
            source_url = references[str(key)].get('source_url',None)
            if source_url:
                index_part=f"**[\[{key}\]]({source_url})**"
            else:
                index_part=f"**[\[{key}\]]**"

            description_part = references[str(key)].get('s3_clean_content','')
            if len(description_part) > 200:
                description_part = references[str(key)].get('s3_clean_content','')[:200] + '...'

            single_ref=f"{index_part} : **({references[str(key)]['date']})** {description_part} \n\n"
            reference_markdown += single_ref

        reference_markdown = reference_markdown.rstrip('\n\n')
        f.write(f"""<details>
        <summary> Referenties</summary>
        {reference_markdown}
        </details> \n\n""")


if __name__ == '__main__':
    OUTPUT_FOLDER = 'frontend/docs/Secties/'
    INPUT_AGREEMENTS_RAW_FOLDER = 'data/agreement_document/sections/raw/'

    structure = get_secties_structure(INPUT_AGREEMENTS_RAW_FOLDER)
    for section in structure:
        section_clean = section.replace('_', ' ').replace('-', ' ').replace('\u2014',' ')
        section_clean = section_clean.lstrip(digits).strip()
        if '.txt' in section_clean:
            create_markdown(INPUT_AGREEMENTS_RAW_FOLDER+structure[section], OUTPUT_FOLDER + section_clean)
            continue
        if not os.path.exists(OUTPUT_FOLDER + section_clean):
            os.mkdir(OUTPUT_FOLDER + section_clean)

        # repeat process for subsections
            for subsection in structure[section]:
                subsection_clean = subsection.replace('_', ' ').replace('-', ' ').replace('\u2014',' ')
                subsection_clean = subsection_clean.lstrip(digits+' .')
                if '.txt' in subsection_clean:
                    create_markdown(INPUT_AGREEMENTS_RAW_FOLDER+structure[section][subsection], OUTPUT_FOLDER + section_clean + '/' + subsection_clean)
                    continue
                if not os.path.exists(OUTPUT_FOLDER + section_clean + '/' + subsection_clean):
                    os.mkdir(OUTPUT_FOLDER + section_clean + '/' + subsection_clean)

                # repeat process for subsubsections
                for subsubsection in structure[section][subsection]:
                    subsubsection_clean = subsubsection.replace('_', ' ').replace('-', ' ').replace('\u2014',' ')
                    subsubsection_clean = subsubsection_clean.lstrip(digits+' .')
                    if '.txt' in subsubsection_clean:
                        create_markdown(INPUT_AGREEMENTS_RAW_FOLDER+structure[section][subsection][subsubsection], OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean)
                        continue
                    if not os.path.exists(OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean):
                        os.mkdir(OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean)

                    # repeat process for subsubsubsections
                    for subsubsubsection in structure[section][subsection][subsubsection]:
                        subsubsubsection_clean = subsubsubsection.replace('_', ' ').replace('-', ' ').replace('\u2014',' ')
                        subsubsubsection_clean = subsubsubsection_clean.lstrip(digits+' .')
                        if '.txt' in subsubsubsection_clean:
                            create_markdown(INPUT_AGREEMENTS_RAW_FOLDER+structure[section][subsection][subsubsection][subsubsubsection], OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean + '/' + subsubsubsection_clean)
                            continue
                        if not os.path.exists(OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean + '/' + subsubsubsection_clean):
                            os.mkdir(OUTPUT_FOLDER + section_clean + '/' + subsection_clean + '/' + subsubsection_clean + '/' + subsubsubsection_clean)



        

