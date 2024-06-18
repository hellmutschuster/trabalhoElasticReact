import React, { useState } from 'react';
import axios from 'axios';

const wordsToRemove = [
  'a',
  'o',
  'um',
  'uma',
  'de',
  'em',
  'para',
  'por',
  'com',
  'até',
  'e',
  'mas',
  'ou',
  'também',
  'se',
  'assim',
  'como',
  'porque'
];

const filterQuery = (query) => {
  const queryWords = query.trim().split(/\s+/);
  
  const queryFiltered = queryWords.filter(word => !wordsToRemove.includes(word));
  
  return queryFiltered.join(' ');
};

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
  
    try {
      const queryFiltered = filterQuery(query);
  
      const response = await axios.post('http://localhost:9200/diario_oficial/_search', {
        query: {
          match: {
            texto_completo: queryFiltered
          }
        }
      });
  
      setResults(response.data.hits.hits);
    } catch (error) {
      console.error('Erro ao realizar a busca', error);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o termo de pesquisa"
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="results">
        {results.map((result) => (
          <div key={result._id} className="result-item">
            <h3>{result._source.titulo}</h3>
            <p>Orgão Emissor: {result._source.orgao}</p>
            <p>Ementa: {result._source.ementa}</p>
            <p>Excerto: {result._source.excerto}</p>
            <p>Assinado Por: {result._source.assinatura}, Cargo: {result._source.cargo}</p>
            <p>Seção: {result._source.secao}, Edição: {result._source.edicao} {result._source.tipo_edicao}, Página: {result._source.pagina}</p>
            <p>Publicado em: {result._source.data_publicacao}</p>
            <p>{result._source.texto_principal}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
