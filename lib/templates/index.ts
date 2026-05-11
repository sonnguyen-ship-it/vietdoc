import type { Template } from "@/lib/types"
import { bienban } from "@/lib/templates/bienban"
import { donnghi } from "@/lib/templates/donnghi"
import { hdkt } from "@/lib/templates/hdkt"
import { hdld } from "@/lib/templates/hdld"
import { hdmb } from "@/lib/templates/hdmb"
import { tncn } from "@/lib/templates/tncn"

export const templates: Template[] = [hdld, tncn, hdkt, hdmb, bienban, donnghi]

export { bienban, donnghi, hdkt, hdld, hdmb, tncn }
