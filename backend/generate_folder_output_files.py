# create output folders and files in docusaurus
# run this script from project root directory
import os
from string import digits
from src.util import get_secties_structure

OUTPUT_FOLDER = 'frontend/docs/Secties/'
INPUT_AGREEMENTS_RAW_FOLDER = 'data/agreement_document/sections/raw/'

structure = get_secties_structure(INPUT_AGREEMENTS_RAW_FOLDER)

def create_markdown(input_path, output_path):
    output_path = output_path.replace('.txt', '')
    with open(input_path, 'r') as f:
        content = f.read()
    with open(output_path + '.md', 'w') as f:
        f.write(content)


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



    

