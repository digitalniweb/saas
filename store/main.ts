import { defineStore } from "pinia";

const state = () => ({
	items: [],
});
const getters = {};
const actions = {};
export const useMainStore = defineStore("mainStore", {
	state,
	getters,
	actions,
});
