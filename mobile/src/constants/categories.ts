import { MaterialIcons } from "@expo/vector-icons";

export interface ServiceCategory {
    id: number;
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    dbValue: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
    { id: 1, name: "Eletricista", icon: "bolt", dbValue: "eletricista" },
    { id: 2, name: "TI & Redes", icon: "laptop", dbValue: "ti_redes" },
    { id: 3, name: "Encanador", icon: "water-damage", dbValue: "encanador" },
    { id: 4, name: "Limpeza", icon: "cleaning-services", dbValue: "limpeza" },
    { id: 5, name: "Montador", icon: "handyman", dbValue: "montador" },
    { id: 6, name: "Pintor", icon: "format-paint", dbValue: "pintor" },
    { id: 7, name: "Entregador", icon: "delivery-dining", dbValue: "entregador" },
    { id: 8, name: "Ar-Condicionado", icon: "ac-unit", dbValue: "ar_condicionado" },
];
