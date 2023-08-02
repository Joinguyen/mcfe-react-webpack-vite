import { TSX_Element_Type } from "./basic.type";

export type PropsWithChildren<P> = P & { children?: TSX_Element_Type };