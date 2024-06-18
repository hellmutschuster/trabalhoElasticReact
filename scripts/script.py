import pandas as pd
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

client = Elasticsearch('http://elasticsearch:9200')

PATH = "diario_oficial.csv"
INDEX_NAME = "diario_oficial"
MAX_ANALYZED_OFFSET = 2000000

def generator(df, index_name, limit = None):

    if limit is not None:
        df = df.head(limit)

    df = df.fillna("Não Especificado")

    df = df.to_dict(orient='records')

    for c, line in enumerate(df):
        yield {
            '_index': index_name,
            '_id': line.get("show_id", None),
            '_source': {
                'titulo': line.get('titulo', ''),
                'orgao': line.get('orgao', ''),
                'ementa': line.get('ementa', ''),
                'excerto': line.get('excerto', ''),
                'texto_principal': line.get('texto_principal', ''),
                'texto_completo': line.get('texto_completo', ''),
                'assinatura': line.get('assinatura', ''),
                'cargo': line.get('cargo', ''),
                'secao': line.get('secao', ''),
                'edicao': line.get('edicao', ''),
                'tipo_edicao': line.get('tipo_edicao', ''),
                'pagina': line.get('pagina', ''),
                'data_publicacao': line.get('data_publicacao', ''),
                'url': line.get('url', ''),
                'url_versao_certificada': line.get('url_versao_certificada', ''),
                'data_captura': line.get('data_captura', ''),
                'data_publicacao_particao': line.get('data_publicacao_particao', '')
            }
        }

def adjust_index_settings(client, index_name, max_analyzed_offset):
    client.indices.close(index=index_name)

    settings = {
        "index": {
            "highlight.max_analyzed_offset": max_analyzed_offset
        }
    }
    client.indices.put_settings(index = index_name, body = settings)

    client.indices.open(index=index_name)

df = pd.read_csv(PATH)

data_generator = generator(df, INDEX_NAME)

bulk(client, data_generator)

adjust_index_settings(client, INDEX_NAME, MAX_ANALYZED_OFFSET)