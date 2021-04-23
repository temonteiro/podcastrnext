import {GetStaticProps} from "next";
import { api } from "../services/api";
import {format, parseISO} from 'date-fns';
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;
  members: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {

  return (
    <div>
      <h1>Hello</h1>
      <p>{JSON.stringify(props.episodes[0])}</p>
    </div>
    
  )
}

 

//SSG
export const getStaticProps:GetStaticProps  = async () => {

  const { data } = await api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  });
  

  return {
    props: {
      episodes: episodes
    },
    revalidate: 60 * 60 * 8 //informa de quanto em quanto tempo deve ser refeita a chamada da API
  }

 
}



//SPA - ruim pra quando precisa que esteja disponível assim que acessa
  /*useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);*/
  
//SSR -- executa toda vez que alguém acessar a aplicação
/*export async function getServerSideProps(){

  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();
  return {
    props: {
      episodes: data
    }
  }
}*/
