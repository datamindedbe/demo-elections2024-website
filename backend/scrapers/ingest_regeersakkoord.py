import fitz
import pathlib
import re
from collections import OrderedDict
import copy

from config_scrapers import (
    SCRAPER_AGREEMENTS_REGEERAKKOORD_PDF_LOCATION,
    SCRAPER_AGREEMENTS_OUTPUT_LOCATION
)


def formatData(t,s):
    if not isinstance(t,dict) and not isinstance(t,list):
        print("\t"*s+str(t))
    else:
        for key in t:
            print("\t"*s+str(key))
            if not isinstance(t,list):
                formatData(t[key],s+1)


# Read PDF pages
with fitz.open(SCRAPER_AGREEMENTS_REGEERAKKOORD_PDF_LOCATION) as pdf_doc:
    text = chr(12).join([page.get_text() for page in pdf_doc])

ix_start = text.index('Inhoudstafel')
ix_end = text.index('Samenvatting', ix_start)

inhoudstafel = text[ix_start:ix_end]

structuur = OrderedDict()

# remove all line feed characters from inhoudstafel
inhoudstafel = inhoudstafel.replace('\x0c', '')

hoofdstukken = list(re.finditer(r'\n(\d+ — .*?) \n\d+(?=\n)', inhoudstafel))

for h, _ in enumerate(hoofdstukken):
    if h + 1 < len(hoofdstukken):
        hoofdstuk = inhoudstafel[hoofdstukken[h].start():hoofdstukken[h + 1].start()]
    else:
        hoofdstuk = inhoudstafel[hoofdstukken[h].start():]
    hoofdstuk = hoofdstuk + '\n'

    structuur[hoofdstukken[h].group(1)] = OrderedDict()
    
    secties = list(re.finditer(r'\n(\d+.\d+ .*?) \n\d+(?=\n)', hoofdstuk, flags=re.DOTALL))
    
    for s, _ in enumerate(secties):
        if s + 1 < len(secties):
            sectie = hoofdstuk[secties[s].start():secties[s + 1].start()]
        else:
            sectie = hoofdstuk[secties[s].start():]
        if not sectie.endswith('\n'):
            sectie = sectie + '\n'

        sectie_naam = ' '.join(secties[s].group(1).split())
        structuur[hoofdstukken[h].group(1)][sectie_naam] = OrderedDict()

        subsecties = list(re.finditer(r'\n(\d+.\d+.\d+ \n.*?) \n\d+(?=\n)', sectie, flags=re.DOTALL))

        for ss, _ in enumerate(subsecties):
            if ss + 1 < len(subsecties):
                subsectie = sectie[subsecties[ss].start():subsecties[ss + 1].start()]
            else:
                subsectie = sectie[subsecties[ss].start():]
            if not subsectie.endswith('\n'):
                subsectie = subsectie + '\n'
            
            subsectie_naam = ' '.join(subsecties[ss].group(1).split())

            structuur[hoofdstukken[h].group(1)][sectie_naam][subsectie_naam] = []
            
            subsubsecties = list(re.findall(r'\n(\d+.\d+.\d+.\d+ .*?) \n\d+(?=\n)', subsectie, flags=re.DOTALL))

            for sss in subsubsecties:
                sss = ' '.join(sss.split())
                structuur[hoofdstukken[h].group(1)][sectie_naam][subsectie_naam].append(sss)

del structuur['3 — Bestuurzaken']['3.2 Concrete voorstellen']['3.2.4 Programma Vlaanderen']
del structuur['3 — Bestuurzaken']['3.2 Concrete voorstellen']['3.2.5 Aankoop']
structuur['3 — Bestuurzaken']['3.2 Concrete voorstellen']['3.2.4 Aankoop'] = []

ix_start = text.index('Inhoudstafel')
ix_end = text.index('Samenvatting', ix_start)

bulk = text[ix_end:]

taglines = [
    'Vlaanderen schittert',
    'Vlaanderen is sociaal en rechtvaardig',
    'Vlaanderen kijkt complexloos vooruit',
    'Vlaanderen  koestert  onze natuur',
    'Vlaanderen bestuurt en investeert, zonder extra lasten',
    'Bijlage'
]

for tagl in taglines:
    to_remove = re.findall(fr'\x0c\d+\n{tagl}\n.*?\n', bulk)

    for rem in to_remove:
        bulk = bulk.replace(rem, '')

# Remove incomplete line breaks
bulk = bulk.replace('-\n', '-').replace('- \n', '- ')

# Remove line feeds
bulk = bulk.replace('\x0c', '')

# Remove page numbers
begin = 13
einde = 213

prev_ix = 0
while begin < einde + 1:
    try:
        new_ix = bulk.index(f'\n{begin}\n', prev_ix)
        prev_ix = new_ix
        len_to_replace = len(f'\n{begin}')
        bulk = bulk[:prev_ix] + bulk[prev_ix + len_to_replace:]
    except ValueError:
        pass
    begin += 1

# Remove new lines
bulk = ' '.join(bulk.split())
# Voorbeeld: 6.3.2 Extra groen (tot 6.3.3 Extra Nederlands)

ix = bulk.index('6.3 Extra maatregelen')
ixx = bulk.index('7 Financien en begroting', ix)

block = bulk[ix:ixx]

volgorde = []

for k in structuur:
    volgorde.append(' '.join(k.replace(' — ', ' ').split()))
    if len(structuur[k]) > 0:
        for kk in structuur[k]:
            volgorde.append(kk)
            if len(structuur[k][kk]) > 0:
                for kkk in structuur[k][kk]:
                    volgorde.append(kkk)
                    if len(structuur[k][kk][kkk]) > 0:
                        for kkkk in structuur[k][kk][kkk]:
                            volgorde.append(kkkk)
def find_section(sectie, start=0):
    try:
        ix = bulk.index(sectie, start)
    except ValueError:
        try:
            sectie =' '.join(sectie.replace(' — ', ' ').split())
            ix = bulk.index(sectie, start)
        except:
            try:
                elements = sectie.split()
                sectie_dot = elements[0] + '. ' + ' '.join(elements[1:])
                ix = bulk.index(sectie_dot, start)
            except ValueError:
                try:
                    sectie = sectie.replace('lagkrachtige', 'slagkrachtige')
                    ix = bulk.index(sectie, start)
                except ValueError:
                    try:
                        bulk_temp = copy.deepcopy(bulk[start:])
                        bulk_temp = bulk_temp.replace('-', '').replace('- ', '')
                        bulk_temp = bulk[:start] + bulk_temp
                        ix = bulk_temp.index(sectie, start)
                    except:
                        ix = bulk_temp.lower().index(sectie.lower(), start)
    return ix

def write_file(sectie, sectienummer, filename, ixx=0):
    print(sectienummer, '|', sectie)
    ix = find_section(sectie, ixx)
    if sectienummer + 1 < len(volgorde):
        ixx = find_section(volgorde[sectienummer + 1], ix)
    else:
        ixx = None

    block = bulk[ix:ixx]

    path = pathlib.Path(f'{SCRAPER_AGREEMENTS_OUTPUT_LOCATION}{filename[:251].replace("/", "")}.txt')
    with open(path, 'w') as openf:
        openf.write(block)
    return ixx

section = 0
ixx = 0
for k in structuur:
    if len(structuur[k]) > 0:
        for kk in structuur[k]:
            section += 1
            if len(structuur[k][kk]) > 0:
            
                for kkk in structuur[k][kk]:
                    section += 1
                    if len(structuur[k][kk][kkk]) > 0:
                        
                        for kkkk in structuur[k][kk][kkk]:
                            section += 1
                            ixx = write_file(kkkk, section, f'{k} - {kk} - {kkk} - {kkkk}', ixx)
                    else:
                        ixx = write_file(kkk, section, f'{k} - {kk} - {kkk}', ixx)
                    
            else:
                ixx = write_file(kk, section, f'{k} - {kk}', ixx)
            
    else:
        ixx = write_file(k, section, f'{k}', ixx)
    section += 1