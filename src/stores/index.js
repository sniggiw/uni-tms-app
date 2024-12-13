import { createPinia } from "pinia";
import persist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(persist);

export default pinia;

export * from "./userInfo.js";
export * from "./other.js";
