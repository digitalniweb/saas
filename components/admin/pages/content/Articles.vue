<template>
	<v-row no-gutters>
		<v-col cols="5">
			<h1>Menu webu</h1>
			<v-btn
				prepend-icon="mdi-plus"
				text="Přidat menu"
				color="green"
				block
				class="my-5"
			></v-btn>
			<h2>Upravit menu</h2>
			<v-treeview
				:items="menusStore.articles"
				density="compact"
				activatable
				item-value="id"
				item-title="name"
				return-object
				:activated="menuTreeActivated"
				@update:activated="
					activatedChanged as Partial<InferAttributes<Article>>
				"
			>
				<template v-slot:prepend="{ item }">
					<v-icon v-if="item.otherUrl">mdi-link-variant</v-icon>
					<v-icon v-else-if="item.freeMenu">mdi-menu-close</v-icon>
				</template>
				<!-- <template v-slot:append="{ item }">
					<div class="hide">
						<v-btn
							@click.prevent.stop="deleteMenu(item)"
							color="red"
							icon="mdi-trash-can-outline"
							size="sm"
						></v-btn>
					</div>
				</template> -->
			</v-treeview>
		</v-col>
		<v-divider class="mx-4" vertical></v-divider>
		<v-spacer></v-spacer>

		<v-col cols="6">
			<v-card>
				<v-tabs
					v-model="tab"
					align-tabs="center"
					bg-color="basil"
					stacked
					grow
				>
					<v-tab value="tab-assignment">
						<v-icon icon="mdi-format-list-numbered"></v-icon>
						Zařazení
					</v-tab>
					<v-tab value="tab-menu">
						<v-icon icon="mdi-menu"></v-icon>
						Menu
					</v-tab>

					<v-tab value="tab-article">
						<v-icon icon="mdi-pencil-outline"></v-icon>
						Článek
					</v-tab>
				</v-tabs>
				<v-card class="pa-5">
					<div v-html="menuEditHeading"></div>
					<v-fab
						@click="deleteCurrentMenu()"
						color="red"
						icon="mdi-trash-can-outline"
						v-tooltip:bottom="'Smazat menu'"
						layout
					></v-fab>
				</v-card>

				<v-tabs-window v-model="tab">
					<v-tabs-window-item :value="'tab-assignment'">
						<v-card class="pa-5">
							<p class="text-overline">Pořadí</p>
							<p class="text-overline mt-5">
								Zařazení do menu
								<v-icon
									v-tooltip:bottom="
										'Aktuální zařazení do menu. Můžete jej změnit'
									"
									icon="mdi-help-circle"
									class="cursor-help"
								/>
							</p>
							<v-treeview
								density="compact"
								activatable
								item-value="id"
								item-title="name"
								class="pickMenuTree"
								:items="pickMenuTree"
								return-object
								:activated="pickMenuTreeActivated"
								@update:activated="
									activatedChangedPickedMenu as menuTreeNode
								"
							>
							</v-treeview>
						</v-card>
					</v-tabs-window-item>
					<v-tabs-window-item :value="'tab-menu'">
					</v-tabs-window-item>
					<v-tabs-window-item :value="'tab-article'">
					</v-tabs-window-item>
				</v-tabs-window>
			</v-card>
		</v-col>
	</v-row>
</template>
<style scoped>
	.pickMenuTree {
		.v-list-item {
			&.v-list-item--active {
				.v-list-item__prepend {
					display: none;
				}
				& + .v-list-group__items {
					display: none !important;
				}
			}
		}
	}
	.v-list-item {
		.hide {
			display: none;
		}
		&:hover {
			.hide {
				display: block;
			}
		}
	}
</style>
<script setup lang="ts">
	import { VTreeview } from "vuetify/labs/VTreeview";
	import { useMenusStore } from "~/store/menus.js";
	import draggable from "vuedraggable";
	import {
		buildTreeType,
		TreeNode,
	} from "~/digitalniweb-custom/helpers/buildTree";
	import { InferAttributes } from "sequelize";
	import { Article } from "~/digitalniweb-types/models/content";
	import getObjectFromArray from "~/digitalniweb-custom/functions/getObjectFromArray";

	type menuTreeNode = TreeNode<Partial<InferAttributes<Article>>>;

	const menusStore = useMenusStore();

	const tab = ref(null);

	const menuEditHeading = computed(() => {
		let currentName = menuTreeActivated.value[0]?.name ?? "Nové menu";
		return `<p
					class="text-subtitle-1 pa-5 border-s-xl rounded border-info bg-black"
				>
					Úprava menu:
					<span class="font-weight-bold">
						${currentName}
					</span>
				</p>`;
	});

	const menuTreeActivated = ref<menuTreeNode[]>([]);

	const pickMenuTreeActivated = ref<menuTreeNode[]>([]);

	const deleteCurrentMenu = () => {
		console.log(menuTreeActivated.value[0]);
	};

	// const deleteMenu = (
	// 	item: buildTreeType<InferAttributes<Article>>[number]
	// ) => {
	// 	console.log(item.id);
	// };

	// for assigning menu to root
	const rootObject = {
		id: 0,
		name: "root",
		order: -1,
		url: "/",
	};

	const activatedChanged = (e: menuTreeNode[]) => {
		// even though it returns array it can contain only 1 activated menu
		if (!e[0]) {
			return;
		}
		menuTreeActivated.value = e;
		if (e[0].parentId == null) {
			pickMenuTreeActivated.value = [rootObject];
		} else {
			let parentObj = getObjectFromArray<menuTreeNode>(
				e[0].parentId,
				menusStore.articles
			);
			if (parentObj) pickMenuTreeActivated.value = [parentObj];
		}
		// let obj = {} as menuTreeNode;
		// if (e[0].parentId === null) {
		// 	obj = pickMenuTree.value[0];
		// } else {
		// 	let parentObj = getObjectFromArray<menuTreeNode>(
		// 		e[0].parentId,
		// 		pickMenuTree.value
		// 	);
		// 	if (parentObj != false) obj = parentObj;
		// }
		// pickMenuTreeActivated.value = [obj];
	};

	const activatedChangedPickedMenu = (e: menuTreeNode[]) => {
		pickMenuTreeActivated.value = e;
	};
	const pickMenuTree = computed(() => {
		return [
			rootObject,
			...menusStore.articles.filter((e) => e.url !== "/"),
		];
	});

	// const pickMenuTree = ref<buildTreeType<Partial<InferAttributes<Article>>>>(
	// 	[]
	// );
	// watch(
	// 	menuTreeActivated,
	// 	(activatedMenu) => {
	// 		let pickMenuTreeNew: buildTreeType<
	// 			Partial<InferAttributes<Article>>
	// 		> = structuredClone(toRaw(menusStore.articles));

	// 		pickMenuTreeNew.shift(); // we don't want index page
	// 		pickMenuTreeNew.unshift({
	// 			id: 0,
	// 			name: "root",
	// 			order: -1,
	// 			url: "/",
	// 		});

	// 		if (activatedMenu[0]) {
	// 			let thisObj = getObjectFromArray<menuTreeNode>(
	// 				activatedMenu[0].id,
	// 				pickMenuTreeNew
	// 			);
	// 			if (thisObj) {
	// 				let parentObj = getObjectFromArray<menuTreeNode>(
	// 					activatedMenu[0].parentId,
	// 					pickMenuTreeNew
	// 				);

	// 				if (parentObj) {
	// 					let thisObjIndex =
	// 						parentObj?.children?.indexOf(thisObj);
	// 					if (thisObjIndex !== undefined && thisObjIndex !== -1)
	// 						parentObj?.children?.splice(thisObjIndex, 1);
	// 					if (parentObj?.children?.length === 0)
	// 						delete parentObj.children;
	// 				}
	// 			}
	// 		}
	// 		pickMenuTree.value = pickMenuTreeNew;
	// 	},
	// 	{
	// 		immediate: true,
	// 	}
	// );
</script>
