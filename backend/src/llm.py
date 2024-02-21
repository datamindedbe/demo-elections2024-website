from typing import Optional
import openai
from config import OPENAI_API_KEY, OPENAI_MODEL_NAME
from src.bedrock import BedrockRetrievedItem
# TODO: Bedrock items and vector db items need to combined into a single type

client = openai.OpenAI(
    api_key=OPENAI_API_KEY
)


def get_response(prompt:str, model_overide=None)->str:
    api_response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=model_overide if model_overide else OPENAI_MODEL_NAME,
    )
    return api_response.choices[0].message.content

def token_count(text:str)->int:
    # tiktoken is not playing nicely on aws lambda so we need to do this 
    # workaround to avoid importing it
    import tiktoken
    encoding = tiktoken.encoding_for_model(OPENAI_MODEL_NAME)
    return len(encoding.encode(text))

def generate_prompt_for_decision_consult(topic_text:str, matching_decisions, max_tokens: int)->str:
    # we can't put a type on the decisions here because it requires importing from the vector db module
    # and this is giving a problem when building the lambda... when there time - fix this
    flat_decisions = [f"{index} - {item.text}" for index, item in enumerate(matching_decisions)]

    prompt_instruction = """
                Het regeerakkoord bevat documenten die de plannen van de regering uitleggen.
                De beslissingen van de regering in de jaren nadien kunnen deze plannen uitvoeren, of van het originele akkoord afwijken.
                Gegeven is het regeringsakkoord en de beslissingen van de regering. 
                Enkel door gebruik te maken van informatie uit de verstrekte documenten,
                geef een beknopte samenvatting van hoe goed de regering
                haar beloften uit het regeerakkoord is nagekomen.
                Als een gegeven beslissing niets te maken heeft met het regeerakkoord, negeer deze beslissing dan.
                Geef verwijzingen naar de beslissingen die in uw antwoord zijn gebruikt, en plaats de verwijzingen tussen vierkante haken, zoals [0][1][2] enz.
                Geef een titel voor uw antwoord en formatteer uw antwoord in markdown.
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

                Uw antwoord:
    """
    return prompt, included_decision_count

def extended_message(message:str)->Optional[str]:
    # this function will take a given message and write it in a more verbose way

    if len(message)==0:
        return None
    
    prompt = f"""            
    Reageer in een paar zinnen op de volgende stelling: {message}
    """

    return get_response(prompt, model_overide="gpt-3.5-turbo")



def decisions_query(query:str, decisions:list[BedrockRetrievedItem], llm_model=None)->str:
    # this function will take a given query and matching decisions and generate a response
    flat_decisions = [f"{index} : {item.text}" for index, item in enumerate(decisions)]
    flat_decisions = "\n".join(flat_decisions)
    prompt = f"""
                Beantwoord de gegeven vraag uitsluitend met behulp van de informatie in het onderstaande gedeelte over regeringsbeslissingen.
                Reageer op een gemoedelijke manier, niet met een lijst.
                Geef het indexnummer van de gebruikte referentie tussen enkelvoudige vierkante haken, zoals [1] of [2][3][4]. 
                combineer referenties niet samen in één haakje

                Vraag:{query}
                Regeringsbeslissingen: {flat_decisions}
                Jouw antwoord:
    """
    return get_response(prompt, model_overide=llm_model)
    

    