import os 

def remove_newline_char(text: str) -> str:
    return text.replace('\n', ' ')

def get_secties_structure(path):
    # a very specific function to get the structure of the secties folder
    # this should be refactored. bad code
    sections = {}
    files = os.listdir(path)

    for file in files:

        combined = file.split('_-_', maxsplit=1)
        if len(combined) == 1:
            section, remainder = combined[0], None
        else:
            section, remainder = combined[0], combined[1]

        if  section not in sections:
            sections[section] = {}

        if remainder is None:
            sections[section]=file
            continue

        subsections = remainder.split('_-_', maxsplit=1)
        if len(subsections) == 1:
            subsection, remainder = subsections[0], None
        else:
            subsection, remainder = subsections[0], subsections[1]

        if subsection not in sections[section]:
            sections[section][subsection] = {}

        if remainder is None:
            sections[section][subsection]=file
            continue

        subsubsections = remainder.split('_-_', maxsplit=1)
        if len(subsubsections) == 1:
            subsubsection, remainder = subsubsections[0], None
        else:
            subsubsection, remainder = subsubsections[0], subsubsections[1]
            
        if subsubsection not in sections[section][subsection]:
            sections[section][subsection][subsubsection] = {}

        if remainder is None:
            sections[section][subsection][subsubsection]=file
            continue

        subsubsubsections = remainder.split('_-_', maxsplit=1)
        if len(subsubsubsections) == 1:
            subsubsubsection, remainder = subsubsubsections[0], None
        else:
            subsubsubsection, remainder = subsubsubsections[0], subsubsubsections[1]

        if subsubsubsection not in sections[section][subsection][subsubsection]:
            sections[section][subsection][subsubsection][subsubsubsection] = {}

        if remainder is None:
            sections[section][subsection][subsubsection][subsubsubsection]=file
            continue

        subsubsubsubsections = remainder.split('_-_', maxsplit=1)
        if len(subsubsubsubsections) == 1:
            subsubsubsubsection, remainder = subsubsubsubsections[0], None
        else:
            subsubsubsubsection, remainder = subsubsubsubsections[0], subsubsubsubsections[1]

        if subsubsubsubsection not in sections[section][subsection][subsubsection][subsubsubsection]:
            sections[section][subsection][subsubsection][subsubsubsection][subsubsubsubsection] = {}

        if remainder is None:
            sections[section][subsection][subsubsection][subsubsubsection][subsubsubsubsection]=file
            continue

    return sections
