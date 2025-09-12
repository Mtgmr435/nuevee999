import { roleplayLevel1 } from "./communication/roleplayLevel1"
import { quizLevel2 } from "./communication/quizLevel2"
import { roleplayLevel3 } from "./communication/roleplayLevel3"
import { quizLevel4 } from "./communication/quizLevel4"
import { roleplayLevel5 } from "./communication/roleplayLevel5"

export const levelsMap: Record<number, any> = {
  1: roleplayLevel1,
  2: quizLevel2,
  3: roleplayLevel3,
  4: quizLevel4,
  5: roleplayLevel5,
}