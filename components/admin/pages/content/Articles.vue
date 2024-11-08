<template>
	<v-row no-gutters>
		<v-col cols="5">
			<h1>{{ translate("Web menu") }}</h1>
			<v-btn
				prepend-icon="mdi-plus"
				:text="translate('Add menu')"
				color="green"
				block
				class="my-5"
				@click="createNewMenu"
			></v-btn>
			<h2>{{ translate("Edit menu") }}</h2>
			<v-treeview
				:items="menus ?? []"
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
			<v-scroll-x-transition origin="center right">
				<v-card v-show="showEdits">
					<v-tabs
						v-model="tab"
						align-tabs="center"
						bg-color="basil"
						stacked
						grow
					>
						<v-tab value="tab-assignment">
							<v-icon icon="mdi-format-list-numbered"></v-icon>
							{{ translate("Location") }}
						</v-tab>
						<v-tab value="tab-menu">
							<v-icon icon="mdi-menu"></v-icon>
							Menu
						</v-tab>

						<v-tab value="tab-article">
							<v-icon icon="mdi-pencil-outline"></v-icon>
							{{ translate("Article") }}
						</v-tab>
					</v-tabs>
					<v-card class="pa-5">
						<div>
							<p
								class="text-subtitle-1 pa-5 border-s-xl rounded border-info bg-black"
							>
								<span class="font-weight-bold">
									{{ menuEditHeading }}
								</span>

								<v-switch
									v-if="menudata"
									id="menuActive"
									color="green"
									density="compact"
									hide-details
									:label="translate('Active')"
									name="menuActive"
									v-model="menudata.active"
								/>
							</p>
						</div>
						<v-fab
							@click="saveCurrentMenu()"
							color="green"
							icon="mdi-check"
							v-tooltip:bottom="translate('Save') + ' menu'"
							style="left: 10px"
						></v-fab>
						<v-fab
							@click="deleteCurrentMenu()"
							color="red"
							icon="mdi-trash-can-outline"
							v-tooltip:bottom="translate('Delete') + ' menu'"
							style="left: 70px"
							size="small"
						></v-fab>
					</v-card>

					<v-tabs-window v-model="tab">
						<v-tabs-window-item :value="'tab-assignment'">
							<v-card class="pa-5">
								<p class="text-overline">
									{{ translate("Order") }}
								</p>
								<v-select
									:items="pickMenuOrder"
									return-object
									item-value="order"
									v-model="selectedOrder"
								>
									<template
										v-slot:item="{ props, item, index }"
									>
										<v-list-item v-bind="props" title=""
											><i>{{ index + 1 }}.</i>
											{{
												index === 0
													? ""
													: translate("After")
											}}
											<strong>
												{{ item.raw.name }}
											</strong>
										</v-list-item>
									</template>
								</v-select>
								<p class="text-overline mt-5">
									{{ translate("MenuLocation") }}
									<v-tooltip location="bottom">
										<template v-slot:activator="{ props }">
											<v-icon
												icon="mdi-help-circle"
												class="cursor-help"
												v-bind="props"
											/>
										</template>
										<span
											v-html="
												translate('MenuParentTooltip')
											"
										></span>
									</v-tooltip>
								</p>
								<v-treeview
									density="compact"
									item-value="id"
									item-title="name"
									class="pickMenuTree"
									:items="pickMenuTree"
									return-object
									activatable
									:activated="pickMenuTreeActivated"
									@update:activated="
										activatedChangedPickedMenu as menuTreeNode
									"
								>
								</v-treeview>
							</v-card>
						</v-tabs-window-item>
						<v-tabs-window-item :value="'tab-menu'">
							<v-card v-if="menudata" class="pa-5">
								<CustomDate
									:date="menudata.createdAt"
									title="Created"
									icon="mdi-calendar-clock"
									variant="outlined"
								/>
								<CustomDate
									:date="menudata.updatedAt"
									title="Updated"
									icon="mdi-calendar-edit"
									variant="outlined"
								/>
								<v-divider class="my-3"></v-divider>
								<v-text-field
									variant="underlined"
									:label="translate('Name')"
									counter="64"
									prepend-inner-icon="mdi-alpha-n"
									v-model="menudata.name"
									dense
								/>
								<v-text-field
									variant="underlined"
									label="Title"
									counter="128"
									prepend-inner-icon="mdi-text-short"
									v-model="menudata.title"
									dense
								/>
								<v-text-field
									variant="underlined"
									label="Description"
									counter="256"
									prepend-inner-icon="mdi-text"
									v-model="menudata.description"
									dense
								/>
								<v-text-field
									variant="underlined"
									:label="translate('Icon')"
									counter="64"
									:prepend-inner-icon="
										(menudata.icon &&
											'mdi-' + menudata.icon) ||
										'mdi-close'
									"
									v-model="menudata.icon"
									dense
								>
									<template v-slot:append>
										<CustomFormPickIcon
											:currentIcon="menudata.icon"
											@changedIcon="changedIcon"
										></CustomFormPickIcon>
									</template>
								</v-text-field>
								<CustomFormPickImage
									:object="menudata"
									property="image"
								/>
							</v-card>
						</v-tabs-window-item>
						<v-tabs-window-item :value="'tab-article'">
						</v-tabs-window-item>
					</v-tabs-window>
				</v-card>
			</v-scroll-x-transition>
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
	import draggable from "vuedraggable";
	import {
		buildTreeType,
		TreeNode,
	} from "~/digitalniweb-custom/helpers/buildTree";
	import { InferAttributes } from "sequelize";
	import { Article } from "~/digitalniweb-types/models/content";
	import getObjectFromArray from "~/digitalniweb-custom/functions/getObjectFromArray";
	import { useSnackBarsStore } from "~/store/snackBars";
	const snackBars = useSnackBarsStore();

	import { moduleResponse } from "~/digitalniweb-types/apps/communication/modules";

	const { fetchData } = useApiCall();

	const menus = ref<buildTreeType<InferAttributes<Article>> | null>(null);
	menus.value =
		(await fetchData<buildTreeType<InferAttributes<Article>> | null>(
			"/api/website/admin/menu"
		)) ?? [];

	if (menus.value.length === 0)
		snackBars.setSnackBar({
			color: "error",
			text: "Nepodařilo se stáhnout menu.",
		});

	const pickMenuTreeActivated = ref<menuTreeNode[]>([]);

	const selectedOrder = ref({});

	const newMenu = ref(false);
	const menuTreeActivated = ref<menuTreeNode[]>([]);

	let translations = {
		"Main menu": {
			cs: "Hlavní menu",
		},
		"Web menu": {
			cs: "Menu webu",
		},
		"Add menu": {
			cs: "Přidat menu",
		},
		"Edit menu": {
			cs: "Upravit menu",
		},
		Article: {
			cs: "Článek",
		},
		Location: {
			cs: "Zařazení",
		},
		MenuLocation: {
			en: "Menu location",
			cs: "Zařazení do menu",
		},
		MenuParentTooltip: {
			en: `Current menu's location; menu's parent.<br />
				You can change this. <br />
				Change of index page (main page)
				can't be done, it can't be put into this menu. <br />
				That is why it is not even listed as the first item in the menu and 'Main menu'
				means first after the index page.`,
			cs: `Aktuální zařazení do menu.<br />
				Můžete jej změnit. <br />
				Měnit zařazení indexové (hlavní stránky)
				nemůžete měnit a nelze ani zařadit do
				tohoto menu. <br />
				Proto není ani v nabídce a pořadí první
				se myslí první za indexovou stránkou.`,
		},
		Name: {
			cs: "Název",
		},
		"As first": {
			cs: "Jako první",
		},
		After: {
			cs: "Za",
		},
	};
	const { translate } = useTranslations(translations);

	let formdataMenu: ReturnType<typeof useFormData<InferAttributes<Article>>>;
	const menudata = ref<InferAttributes<Article> | null>(null);

	type menuTreeNode = TreeNode<Partial<InferAttributes<Article>>>;

	// for assigning menu to root
	const rootObject = {
		id: 0,
		name: translate("Main menu"),
		order: -1,
		url: "/",
	};

	const createNewMenu = () => {
		newMenu.value = true;
		menuTreeActivated.value = [];
		pickMenuTreeActivated.value = [rootObject];
		menudata.value = {} as InferAttributes<Article>;
	};

	const showEdits = computed(() => {
		if (newMenu.value === true || menuTreeActivated.value.length > 0)
			return true;
		return false;
	});

	const tab = ref(null);

	const menuEditHeading = computed(() => {
		return menuTreeActivated.value[0]?.name ?? "Nové menu";
	});

	// currently picked Menu's order
	const pickMenuOrder = ref<menuTreeNode[]>([]);
	const firstOrder = { title: "1", name: translate("As first"), order: 0 };
	const createMenuOrder = (selectFirst = false) => {
		let orderOptions = [firstOrder] as menuTreeNode[];
		if (selectFirst) selectedOrder.value = firstOrder;

		let children = [] as menuTreeNode[];

		let pickedLevelMenus = [] as menuTreeNode[];
		if (pickMenuTreeActivated.value[0]?.id === 0) {
			// top level menus
			pickedLevelMenus = menus.value ?? [];
		} else if (pickMenuTreeActivated.value[0]?.children) {
			pickedLevelMenus = pickMenuTreeActivated.value[0]?.children ?? [];
		}

		pickedLevelMenus.forEach((el, i) => {
			let currentOrderOption = {
				title: (i + 2).toString(),
				name: el.name,
				order: (el?.order ?? 0) + 1,
			};

			if (i === menuTreeActivated.value[0].order) {
				if (i === 0) {
					selectedOrder.value = orderOptions[0];
				} else {
					selectedOrder.value = children[i - 1];
				}
				return;
			}
			children.push(currentOrderOption);
		});

		orderOptions.push(...children);

		pickMenuOrder.value = orderOptions;
	};

	const deleteCurrentMenu = () => {
		console.log(menuTreeActivated.value[0]);
	};

	const saveCurrentMenu = () => {
		console.log(menuTreeActivated.value[0]);
	};

	const activatedChanged = async (e: menuTreeNode[]) => {
		// even though it returns array it can contain only 1 activated menu
		if (e.length === 0) return;

		newMenu.value = false;
		menuTreeActivated.value = e;
		if (e[0].parentId == null) {
			pickMenuTreeActivated.value = [rootObject];
		} else if (menus.value) {
			let parentObj = getObjectFromArray<menuTreeNode>(
				e[0].parentId,
				menus.value
			);
			if (parentObj) pickMenuTreeActivated.value = [parentObj];
		}

		const data = await fetchData<moduleResponse<
			InferAttributes<Article>
		> | null>("/api/content/article", {
			params: {
				url: menuTreeActivated.value[0]?.url ?? "/",
			},
		});

		if (data?.moduleInfo) {
			formdataMenu = useFormData(data?.moduleInfo);
			menudata.value = formdataMenu.dataClone;
		}
		createMenuOrder();
	};

	const activatedChangedPickedMenu = (e: menuTreeNode[]) => {
		let currentMenuId = menuTreeActivated.value[0]?.id;
		if (currentMenuId === undefined) return;

		let currentPickMenuId = pickMenuTreeActivated.value[0]?.id;
		let clickedPickMenuId = e[0]?.id;

		if (clickedPickMenuId === undefined) return;
		if (currentPickMenuId === clickedPickMenuId) return;

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
		createMenuOrder(true);
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
			...(menus.value?.filter((e) => e.url !== "/") ?? []),
		];
	});

	const changedIcon = (icon: string) => {
		if (menudata.value?.icon !== undefined) menudata.value.icon = icon;
	};

	// const pickMenuTree = ref<buildTreeType<Partial<InferAttributes<Article>>>>(
	// 	[]
	// );
	// watch(
	// 	menuTreeActivated,
	// 	(activatedMenu) => {
	// 		let pickMenuTreeNew: buildTreeType<
	// 			Partial<InferAttributes<Article>>
	// 		> = structuredClone(toRaw(menus.value));

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
