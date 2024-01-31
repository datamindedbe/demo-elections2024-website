import openai
import tiktoken
from src import OPENAI_API_KEY
from src.vector_store import VectorDBItem

MODEL = "gpt-4-1106-preview"

client = openai.OpenAI(
    api_key=OPENAI_API_KEY
)

encoding = tiktoken.encoding_for_model(MODEL)

def get_response(prompt:str)->str:
    api_response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=MODEL,
    )
    return api_response.choices[0].message.content

def token_count(text:str)->int:
    return len(encoding.encode(text))

def generate_prompt_for_decision_consult(topic_text:str, matching_decisions:list[VectorDBItem], max_tokens: int)->str:
    flat_decisions = [f"{index} - {item.text}" for index, item in enumerate(matching_decisions)]

    prompt_instruction = """
                Het regeerakkoord bevat documenten die de plannen van de regering uitleggen.
                De beslisssingen van de regering in de jaren nadien kunnen deze plannen uitvoeren, of van het originele akkoord afwijken.
                Gegeven het regeringsakkoord en de beslissingen van de regering. 
                Door alleen informatie uit de verstrekte documenten te gebruiken,
                wordt een samenvatting op hoog niveau gegeven van hoe goed de regering
                haar beloften uit het regeerakkoord is nagekomen.
                als een besluit geen relatie heeft met het regeerakkoord, beschouw het dan niet in de reactie.
                Geef verwijzingen naar de beslissingen die in uw antwoord zijn gebruikt, en plaats de verwijzingen tussen vierkante haken, zoals [0][1][2] enz.
                Geef aan het begin een titel voor uw antwoord en formatteer uw antwoord in markdown
    """

    total_tokens = token_count(prompt_instruction) + token_count(topic_text)
    included_decision_count = 0

    for decision in flat_decisions:
        total_tokens += token_count(decision)
        if total_tokens > max_tokens:
            break
        included_decision_count += 1

    # only include as many decisons that can fit in the max token count
    flat_decisions = "\n".join(flat_decisions[:included_decision_count])


    prompt = f"""
                {prompt_instruction}
                Regeerakkoord: {topic_text} 
                Beslissingen: {flat_decisions}

                Jou antwoord:
    """
    return prompt, included_decision_count