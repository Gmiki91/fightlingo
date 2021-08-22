import { AuthService } from "./services/auth.service";
import { CharacterService } from "./services/character.service";
import { EventHandler } from "./services/event-handler.service";
import { ItemService } from "./services/item.service";
import { PublicationService } from "./services/publication.service";
import { QuizService } from "./services/quiz.service";
import { ScrollService } from "./services/scroll.service";

export const Services = [
    QuizService,
    AuthService,
    ScrollService,
    EventHandler,
    PublicationService,
    CharacterService,
    ItemService,
]