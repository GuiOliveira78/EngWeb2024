import json

def read_json_file(file_path):
    bd = []
    try:
        with open(file_path, 'r', encoding='utf-8') as json_file:
            # Lê o conteúdo do arquivo JSON inteiro
            data = json.load(json_file)
            # Extrai a lista de compositores
            bd = data["compositores"]
    except FileNotFoundError:
        print(f"O ficheiro {file_path} não foi encontrado")
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar o JSON: {e}")
        raise
    except Exception as e:
        print(f"Ocorreu um erro: {e}")
        raise  # Re-levanta a exceção para interromper a execução

    return bd




def pertenceCompositor(valor, lista):
    encontrado = False
    i = 0
    while i < len(lista) and not encontrado:
        if lista[i]['id'] == valor:
            encontrado = True
        i += 1
    return encontrado

def calc_Compositores(bd):
    compositores = []
    for reg in bd:
        if not pertenceCompositor(reg['id'], compositores) and reg != '':
                    compositores.append(reg)
    return compositores

def pertencePeriodo(valor, lista):
    encontrado = False
    i = 0
    while i < len(lista) and not encontrado:
        if lista[i]['periodo'] == valor:
            encontrado = True
        i += 1
    return encontrado

def calc_Periodos(bd):
    periodos = []
    id = 0
    for reg in bd:
        if not pertencePeriodo(reg['periodo'], periodos) and reg != '':
            periodos.append({
                'id' : f"{id}",
                'periodo' : reg['periodo'],
                'compositores' : [{'id': reg['id'], 'nome': reg['nome']}]
            })
            id += 1
        elif pertencePeriodo(reg['periodo'], periodos) and reg['nome'] != '':
            for p in periodos:
                if p['periodo'] == reg['periodo']:
                    p['compositores'].append({'id': reg['id'], 'nome': reg['nome']})
    return periodos

file_path = 'compositores.json'
myBD = read_json_file(file_path)
compositores = calc_Compositores(myBD)
periodos = calc_Periodos(myBD)

novaBD = {
    'compositores' : compositores,
    'periodos' : periodos
}

f = open("new_compositores.json", "w", encoding='utf-8')
json.dump(novaBD, f, indent = 2, ensure_ascii=False)
f.close()