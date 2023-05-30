import { Options } from "./options";

export interface Questions {
    id: number,
    text: string,
    options: Options[],
    selectedAnswerID: number | null
}
