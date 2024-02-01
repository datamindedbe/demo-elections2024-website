import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'overdaad aan informatie?',
    image: 'img/emoji_hurt.png',
    description: (
      <>
      Het publiek heeft toegang tot alle beslissingen die de Vlaamse overheid neemt. Het kan echter overweldigend zijn om al deze documenten zelf door te nemen om te begrijpen wat belangrijk is
      </>
    ),
  },
  {
    title: 'We maken gebruik van AI om erachter te komen wat belangrijk is',
    image: 'img/emoji_nerd.png',
    description: (
      <>

We hebben geëxperimenteerd met de nieuwste AI-modellen om te bepalen of deze ons kunnen helpen inzicht te krijgen in de beslissingen van de overheid
     </>
    ),
  },
  {
    title: 'zodat u een eenvoudig overzicht krijgt',
    image: 'img/emoji_heart_eyes.png',
    description: (
      <>

we creëerden een eenvoudig te begrijpen overzicht waarin wordt geprobeerd de beslissingen van de overheid te koppelen aan de plannen uit het Vlaamse Regeerakkoord (2019-2024)
      </>
    ),
  }
];

function Feature({image, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      < img style={{"max-width":"100px"}} src={image} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
        {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
