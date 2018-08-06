import React from 'react'
import { IMDB_ACTOR_SEARCH } from '../constants/constants';

const decorateActorNames = (actors) => actors.split(', ').map((actor, index, actors) => <span key={`actor-${index}`}><a target="_blank" href={`${IMDB_ACTOR_SEARCH}${actor}`}>{actor}</a>{(index < actors.length - 1) && ', ' }</span>)

export { decorateActorNames }
