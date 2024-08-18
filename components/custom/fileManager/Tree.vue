<template>
	<v-card
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
				:items="items"
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
						<v-icon v-if="item.type === 'dir'">{{
							open
								? "mdi-folder-open-outline"
								: "mdi-folder-outline"
						}}</v-icon>
						<v-icon v-else>{{
							icons[item.extension.toLowerCase()] ||
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
	</v-card>
</template>
<script setup>
	import { ref, watch, onMounted } from "vue";
	import { VTreeview } from "vuetify/labs/VTreeview";
	let emit = defineEmits([
		"loading",
		"path",
		" endpoints",
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
	const items = ref([]);
	const filter = ref("");

	const preventTreeclick = (item, active, event) => {
		if (active) return event.stopPropagation();
		return null;
	};

	const init = () => {
		opened.value = [];
		items.value = [];
		setTimeout(() => {
			items.value = [
				{
					type: "dir",
					path: "/",
					basename: "Hlavní adresář",
					extension: "",
					name: "root",
					children: [],
				},
			];
			activeTrees.value = ["/"];
			setTimeout(() => {
				opened.value = ["/"];
			}, 0);
		}, 0);
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

	const activeChanged = (active) => {
		activeTrees.value = active;
		let path = "";
		if (active.length) {
			path = active[0];
		}
		if (props.path != path) {
			emit("path-changed", path);
		}
	};

	const findItem = (path) => {
		let stack = [];
		stack.push(items.value[0]);
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

	watch(() => props.storage, init);
	watch(
		() => props.path,
		() => {
			activeTrees.value = [props.path];
			if (!opened.value.includes(props.path)) {
				opened.value.push(props.path);
			}
		}
	);
	watch(
		() => props.refreshPending,
		async () => {
			if (props.refreshPending) {
				let item = findItem(props.path);
				await readFolder(item);
				emit("refreshed");
			}
		}
	);

	onMounted(init);
</script>
