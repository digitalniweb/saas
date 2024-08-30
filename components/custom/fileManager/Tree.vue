<template>
	<!-- <v-card
		flat
		tile
		width="250"
		min-height="380"
		class="d-flex flex-column folders-tree-card"
	>
		<div class="grow scroll-x">
			<v-treeview
				:open="opened"
				:active="activeTrees"
				:items="fileManagerStore.items.dirs"
				:search="filter"
				:load-children="readFolder"
				v-on:update:active="activeChanged"
				item-key="path"
				item-text="basename"
				dense
				activatable
				transition
				class="folders-tree"
			>
				<template v-slot:prepend="{ item, open, active }">
					<div
						@click="preventTreeclick(item, active, $event)"
						@dblclick="returnItem(item)"
					>
						<v-icon v-if="!item.extension">{{
							open
								? "mdi-folder-open-outline"
								: "mdi-folder-outline"
						}}</v-icon>
						<v-icon v-else>{{
							icons[item?.extension?.toLowerCase()] ||
							icons["other"]
						}}</v-icon>
					</div>
				</template>
				<template v-slot:label="{ item, active }">
					<div
						@click="preventTreeclick(item, active, $event)"
						@dblclick="returnItem(item)"
					>
						{{ item.basename }}
						<v-btn
							icon
							v-if="item.type === 'dir'"
							@click.stop="readFolder(item)"
							class="ml-1"
						>
							<v-icon class="pa-0 mdi-18px" color="grey lighten-1"
								>mdi-refresh</v-icon
							>
						</v-btn>
					</div>
				</template>
			</v-treeview>
		</div>
		<v-divider></v-divider>
		<v-toolbar dense flat class="shrink">
			<v-text-field
				solo
				flat
				hide-details
				label="Filter"
				v-model="filter"
				prepend-inner-icon="mdi-filter-outline"
				class="ml-n3"
			></v-text-field>
			<v-btn icon @click="init" v-tooltip:top.eager="`Zavřít vše`">
				<v-icon>mdi-collapse-all-outline</v-icon>
			</v-btn>
		</v-toolbar>
	</v-card> -->
</template>
<script setup>
	/* import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

	import { ref, watch } from "vue";
	import { VTreeview } from "vuetify/labs/VTreeview";
	let emit = defineEmits([
		"loading",
		"path",
		"endpoints",
		"path-changed",
		"refreshed",
	]);

	const props = defineProps({
		icons: Object,
		storage: String,
		path: String,
		endpoints: Object,
		axios: Function,
		refreshPending: Boolean,
	});

	const opened = ref([]);
	const activeTrees = ref([]);
	const filter = ref("");

	const preventTreeclick = (item, active, event) => {
		if (active) return event.stopPropagation();
		return null;
	};

	const init = () => {
		opened.value = [];
		setTimeout(() => {
			activeTrees.value = ["/"];
			setTimeout(() => {
				opened.value = ["/"];
			}, 0);
		}, 0);
	};

	const activeChanged = (active) => {
		activeTrees.value = active;
		let path = "";
		if (active.length) {
			path = active[0];
		}
		if (fileManagerStore.path != path) {
			emit("path-changed", path);
		}
	};

	const findItem = (path) => {
		let stack = [];
		stack.push(fileManagerStore.items.value[0]);
		while (stack.length > 0) {
			let node = stack.pop();
			if (node.path == path) {
				return node;
			} else if (node.children && node.children.length) {
				for (let i = 0; i < node.children.length; i++) {
					stack.push(node.children[i]);
				}
			}
		}
		return null;
	};

	const readFolder = async (item) => {
		emit("loading", true);
		let url = props.endpoints.list.url
			.replace(new RegExp("{storage}", "g"), props.storage)
			.replace(new RegExp("{path}", "g"), item.path);

		let config = {
			url,
			method: props.endpoints.list.method || "get",
		};

		let response = await props.axios.request(config);

		item.children = response.data.reduce((accumulator, current) => {
			if (current.type === "dir") {
				current.children = [];
				accumulator.push(current);
			}
			return accumulator;
		}, []);

		emit("loading", false);
	};

	watch(
		() => fileManagerStore.path,
		() => {
			activeTrees.value = [fileManagerStore.path];
			if (!opened.value.includes(fileManagerStore.path)) {
				opened.value.push(fileManagerStore.path);
			}
		}
	);
	watch(
		() => fileManagerStore.refreshPending,
		async () => {
			if (fileManagerStore.refreshPending) {
				let item = findItem(fileManagerStore.path);
				await readFolder(item);
				emit("refreshed");
			}
		}
	);

	init(); */
</script>
