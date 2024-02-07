import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Overdaad aan informatie?',
    image: 'img/emoji_hurt.png',
    description: (
      <>
      U heeft gratis toegang tot alle documenten van de Vlaamse overheid, maar het is ondoenbaar en overweldigend om al deze documenten zelf te lezen. Hoe weet u wat belangrijk en relevant is?
      </>
    ),
  },
  {
    title: 'Onze AI-modellen analyseren tienduizenden overheidsdocumenten...',
    image: 'img/emoji_nerd.png',
    description: (
      <>

We zetten de nieuwste en meest krachtige AI-modellen in om inzicht te verwerven in de beslissingen van de Vlaamse overheid.
     </>
    ),
  },
  {
    title: '... zodat u een overzichtelijk beeld krijgt.',
    image: 'img/emoji_heart_eyes.png',
    description: (
      <>

U krijgt een overzicht van de plannen van het Vlaamse regering en welke beslissingen de regering genomen heeft om deze plannen waar te maken.
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
