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
							<v-select
								:items="pickMenuOrder"
								return-object
								item-value="id"
								v-model="selectedOrder"
							>
								<template v-slot:item="{ props, item, index }">
									<v-list-item v-bind="props" title=""
										><i>{{ index + 1 }}.</i>
										{{ item.value != 0 ? "Za " : "" }}
										<strong>{{
											item.raw.name
										}}</strong></v-list-item
									>
								</template>
							</v-select>
							<p class="text-overline mt-5">
								Zařazení do menu
								<v-tooltip location="bottom">
									<template v-slot:activator="{ props }">
										<v-icon
											icon="mdi-help-circle"
											class="cursor-help"
											v-bind="props"
										/>
									</template>
									Aktuální zařazení do menu.<br />
									Můžete jej změnit. <br />
									Měnit zařazení indexové (hlavní stránky)
									nemůžete měnit a nelze ani zařadit do tohoto
									menu. <br />
									Proto není ani v nabídce a pořadí první se
									myslí první za indexovou stránkou.
								</v-tooltip>
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
<style>
	/* .pickMenuTree {
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
	} */
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
	import { TreeNode } from "~/digitalniweb-custom/helpers/buildTree";
	import { InferAttributes } from "sequelize";
	import { Article } from "~/digitalniweb-types/models/content";
	import getObjectFromArray from "~/digitalniweb-custom/functions/getObjectFromArray";
	import { useSnackBarsStore } from "~/store/snackBars";

	const snackBars = useSnackBarsStore();

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

	// const pickMenuOrder = ref([]);

	const pickMenuOrder = computed(() => {
		let orderOptions = [
			{ id: 0, title: "1", name: "Jako první" },
		] as menuTreeNode[];
		if (pickMenuTreeActivated.value[0]?.children) {
			let children = pickMenuTreeActivated.value[0]?.children.map(
				(el) => {
					return {
						id: el.id,
						title: ((el.order ?? 0) + 2).toString(),
						name: el.name,
					};
				}
			);
			orderOptions.push(...children);
		}
		selectedOrder.value = orderOptions[0];
		return orderOptions;
	});

	const menuTreeActivated = ref<menuTreeNode[]>([]);

	const pickMenuTreeActivated = ref<menuTreeNode[]>([]);

	const selectedOrder = ref({});

	const deleteCurrentMenu = () => {
		console.log(menuTreeActivated.value[0]);
	};

	// for assigning menu to root
	const rootObject = {
		id: 0,
		name: "Hlavní menu",
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
	};

	const activatedChangedPickedMenu = (e: menuTreeNode[]) => {
		let currentMenuId = menuTreeActivated.value[0]?.id;
		if (currentMenuId === undefined) {
			pickMenuTreeActivated.value = [];
			return;
		}

		let currentPickMenuId = pickMenuTreeActivated.value[0]?.id;
		let clickedPickMenuId = e[0]?.id;

		if (clickedPickMenuId === undefined) return;
		if (clickedPickMenuId !== 0 && currentPickMenuId === clickedPickMenuId)
			return;

		if (currentMenuId === clickedPickMenuId) {
			snackBars.setSnackBar({
				color: "warning",
				text: "Nemůžete zařadit menu do sebe sama.",
			});
			return;
		}

		let child = findById(menuTreeActivated.value[0], clickedPickMenuId);
		if (child) {
			snackBars.setSnackBar({
				color: "warning",
				text: "Nemůžete zařadit menu do sebe sama.",
			});
			return;
		}

		pickMenuTreeActivated.value = e;
	};

	const findById = (obj: menuTreeNode, id: number): menuTreeNode | null => {
		if (obj.id === id) {
			return obj;
		}
		if (obj.children) {
			for (let child of obj.children) {
				let result = findById(child, id);
				if (result) {
					return result;
				}
			}
		}
		return null;
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
