import html
import os
import xml.etree.ElementTree as ET


html = '''
<!DOCTYPE html>
<html>
<head>
    <title>Ruas de Braga</title>
    <meta charset="UTF-8">
</head>
<body>
<h1>Lista de Ruas</h1>
<ul>
{lista_ruas}
</ul>
</body>
</html>
'''

rua_template = '<li><a href="{xml_path}">{nome_rua}</a> - {numero}</li>'

lista_ruas = []
diretorio = 'Ruas/MapaRuas-materialBase/texto'
for file in os.listdir(diretorio):
    
    file_path = os.path.join(diretorio, file)
    with open(file_path, 'r', encoding='utf-8') as file:
        tree = ET.parse(file)
        root = tree.getroot()
    
    nome_rua = root.find('.//nome').text.strip()
    numero = root.find('.//número').text.strip()
    xml_path = f"{diretorio}/{file}"  # Supondo que os arquivos XML estejam em um diretório chamado 'xml'


    lista_ruas.append(rua_template.format(xml_path=xml_path, nome_rua=nome_rua, numero=numero))

html_content = html.format(lista_ruas='\n'.join(lista_ruas))

# Escrevendo o conteúdo HTML no arquivo
with open('ruas.html', 'w', encoding='utf-8') as f:
    f.write(html_content)