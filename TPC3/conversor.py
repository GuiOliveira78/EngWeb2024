import json


def read_json_file(file_path):
    bd = []
    try:
        with open(file_path, 'r') as json_file:
            for line in json_file:
                # Carrega cada linha como um objeto JSON e adiciona à lista
                bd.append(json.loads(line))
    except FileNotFoundError:
        print("O ficheiro {file_path} não foi encontrado")
    except Exception as e:
        print("Ocorreu um erro: {e}")
        raise  # Re-levanta a exceção para interromper a execução

    return bd



def pertence(valor, lista):
    return valor in lista
    
    '''
    encontrado = False
    i = 0
    while i < len(lista) and not encontrado:
        if lista[i]['designacao'] == valor:
            encontrado = True
        i += 1
    return encontrado
    '''

def calc_filmes(bd):
    filmes = []
    for reg in bd:
        if 'title' in reg and 'year' in reg and 'cast' in reg and 'genres' in reg:
            if not pertence(reg, filmes) and reg != '':
                    filmes.append({
                        'id' : reg['_id']['$oid'],
                        'title' : reg['title'],
                        'year' : reg['year'],
                        'cast' : reg['cast'],
                        'genres' : reg['genres']
                    })
                    
        elif 'genres' not in reg:
            if not pertence(reg, filmes) and reg != '':
                    filmes.append({
                        'id' : reg['_id']['$oid'],
                        'title' : reg['title'],
                        'year' : reg['year'],
                        'cast' : reg['cast'],
                        'genres' : []
                    })
    return filmes


def calc_generos(bd):
    generos = []
    id_gen = 0
    for reg in bd:
        if 'genres' in reg:
            for gen in reg['genres']:
                if not pertence(gen, generos) and gen != '':
                    generos.append({
                        'id' : f"{id_gen}",
                        'genero' : gen
                    })
                    id_gen += 1
    return generos

def calc_atores(bd):
    atores = []
    id_ator = 0
    for reg in bd:
        if 'cast' in reg:
            for ator in reg['cast']:
                if not pertence(ator, atores) and ator != '':
                    atores.append({
                        'id' : f"{id_ator}",
                        'nome' : ator,
                        "filmes" : [reg['title']]
                    })
                    id_ator += 1
                elif pertence(ator, atores) and ator != '':
                    atores[ator]['filmes'].append(reg['title'])

    return atores


file_path = 'filmes.json'
myBD = read_json_file(file_path)
filmes = calc_filmes(myBD)
generos = calc_generos(myBD)
atores = calc_atores(myBD)

novaBD = {
    'filmes' : filmes,
    'generos' : generos,
    'atores' : atores
}

f = open("new_filmes.json", "w")
json.dump(novaBD, f, indent = 2)
f.close()