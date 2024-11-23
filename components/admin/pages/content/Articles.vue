<template>
	<v-row no-gutters>
		<v-col cols="12" md="5">
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
			<div class="hints text-right mb-3">
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-icon color="blue" v-bind="props" class="mr-2">
							mdi-link-variant
						</v-icon>
					</template>
					<span v-html="translate('Other URL')"></span>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-icon color="grey" v-bind="props" class="mr-2"
							>mdi-menu-close</v-icon
						>
					</template>
					<span v-html="translate('Free menu')"></span>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-icon color="red" v-bind="props" class="mr-2"
							>mdi-toggle-switch-off-outline</v-icon
						>
					</template>
					<span v-html="translate('Inactive')"></span>
				</v-tooltip>
			</div>
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
				<template v-slot:append="{ item }">
					<v-icon v-if="item.otherUrl" color="blue" size="xs"
						>mdi-link-variant</v-icon
					>
					<v-icon v-if="item.freeMenu" color="grey" size="xs"
						>mdi-menu-close</v-icon
					>
					<v-icon v-if="!item.active" color="red" size="xs"
						>mdi-toggle-switch-off-outline</v-icon
					>
				</template>
			</v-treeview>
		</v-col>
		<v-divider class="mx-4 d-none d-md-block" vertical></v-divider>
		<v-divider class="my-4 d-block d-md-none"></v-divider>
		<v-spacer></v-spacer>

		<v-col cols="12" md="6">
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
							<div
								class="text-subtitle-1 pa-5 border-s-xl rounded border-info bg-black"
							>
								<span class="font-weight-bold">
									{{ menuEditHeading }}
								</span>
								<div v-if="menudata">
									<v-switch
										id="menuActive"
										color="green"
										density="compact"
										hide-details
										:label="translate('Active')"
										name="menuActive"
										v-model="menudata.active"
									/>
									<v-divider class="mb-4"></v-divider>
									<CustomDate
										:date="menudata.createdAt"
										title="Created"
										icon="mdi-calendar-clock"
										variant="outlined"
										class="mb-2"
									/>
									<CustomDate
										:date="menudata.updatedAt"
										title="Updated"
										icon="mdi-calendar-edit"
										variant="outlined"
										class="mb-2"
									/>
								</div>
							</div>
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
								<v-switch
									id="menuFreeMenu"
									color="green"
									density="compact"
									hide-details
									:label="translate('Free menu')"
									name="menuFreeMenu"
									v-model="menudata.freeMenu"
								/>
								<v-divider class="my-3"></v-divider>
								<v-text-field
									variant="underlined"
									:label="translate('Name')"
									counter="64"
									prepend-inner-icon="mdi-alpha-n"
									v-model="menudata.name"
									validate-on="blur"
									:rules="validationMenuNameRules"
								/>
								<p
									class="text-grey text-caption px-1 pb-5 font-italic"
								>
									{{ currentSlug }}
								</p>
								<customFormPickFiles
									:object="menudata"
									property="otherUrl"
									icon="mdi-alpha-u"
									icon-button="mdi-file"
									:rules="validationMenuOtherUrl"
									name="Other URL"
									:translation="translations"
								/>
								<v-text-field
									variant="underlined"
									label="Title"
									counter="128"
									prepend-inner-icon="mdi-text-short"
									v-model="menudata.title"
								/>
								<v-text-field
									variant="underlined"
									label="Description"
									counter="256"
									prepend-inner-icon="mdi-text"
									v-model="menudata.description"
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
								>
									<template v-slot:append>
										<CustomFormPickIcon
											:currentIcon="menudata.icon"
											@changedIcon="changedIcon"
										></CustomFormPickIcon>
									</template>
								</v-text-field>
								<customFormPickFiles
									:object="menudata"
									property="image"
								/>
							</v-card>
						</v-tabs-window-item>
						<v-tabs-window-item :value="'tab-article'">
							<draggable
								v-if="widgetsdata"
								v-model="widgetsdata"
								@change="
									changePositionDragged($event, widgetsdata)
								"
								item-key="id"
								tag="v-list"
							>
								<template #item="{ element: widget, index: i }">
									<v-list-item
										:key="widget.id"
										variant="elevated"
										class="mb-1"
									>
										<template v-slot:prepend>
											<!-- <v-icon
												icon="mdi-swap-vertical"
											></v-icon> -->
											<v-switch
												class="mr-1"
												v-model="widget.active"
												color="green"
												:hide-details="true"
												@change="
													changeArticleWidgetProperty(
														$event,
														'active',
														widget
													)
												"
											></v-switch>
											<v-icon>
												{{
													getWidget(widget.widgetId)
														?.icon || "mdi-cube"
												}}
											</v-icon>
										</template>
										<template v-slot:default>
											<v-list-item-subtitle
												class="text--primary"
												v-text="
													getWidget(widget.widgetId)
														?.name || ''
												"
											></v-list-item-subtitle>
											<v-list-item-title
												v-text="translate(widget.name)"
											></v-list-item-title>
										</template>
										<template v-slot:append>
											<v-list-item-action>
												<v-btn
													icon="mdi-chevron-up"
													size="x-small"
													:disabled="i === 0"
													@click="
														changeWidgetPosition(
															'up',
															i,
															widget
														)
													"
												/>
												<v-btn
													class="mr-1"
													icon="mdi-chevron-down"
													size="x-small"
													:disabled="
														i ===
														widgetsdata.length - 1
													"
													@click="
														changeWidgetPosition(
															'down',
															i,
															widget
														)
													"
												/>
												<v-btn
													class="mr-1"
													size="x-small"
													color="blue-lighten-5"
													icon="mdi-pencil"
												/>
												<v-btn
													size="x-small"
													color="red"
													icon="mdi-delete-outline"
													@click="
														deleteWidget(widget, i)
													"
												/>
											</v-list-item-action>
										</template>
									</v-list-item>
								</template>
							</draggable>
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
	import slugify from "slugify";
	import draggable from "vuedraggable";
	import {
		buildTreeType,
		TreeNode,
	} from "~/digitalniweb-custom/helpers/buildTree";
	import { InferAttributes } from "sequelize";
	import {
		Article,
		WidgetContent,
	} from "~/digitalniweb-types/models/content";
	import getObjectFromArray from "~/digitalniweb-custom/functions/getObjectFromArray";
	import { useSnackBarsStore } from "~/store/snackBars";
	const snackBars = useSnackBarsStore();

	import { moduleResponse } from "~/digitalniweb-types/apps/communication/modules";
	import validator from "validator";
	import { Widget } from "../../../../digitalniweb-types/models/globalData";

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
		"Other URL": {
			cs: "Jiné URL",
		},
		Inactive: {
			cs: "Neaktivní",
		},
		"Free menu": {
			cs: "Volné menu",
		},
	};
	const { translate } = useTranslations(translations);

	let formdataMenu: ReturnType<typeof useFormData<InferAttributes<Article>>>;
	let formdataWidgets: ReturnType<
		typeof useFormData<InferAttributes<WidgetContent>[]>
	>;
	const menudata = ref<InferAttributes<Article> | null>(null);
	const widgetsdata = ref<InferAttributes<WidgetContent>[] | null>(null);

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

		if (data?.widgetContents) {
			formdataWidgets = useFormData(data?.widgetContents);
			widgetsdata.value = formdataWidgets.dataClone;
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

	const validationMenuNameRules = computed(() => [
		() => !!menudata.value?.name || "Vyplňte prosím toto pole",
		() =>
			menuSlugValidation() ||
			"Menu se shodným URL již existuje! Změňte prosím název.",
	]);

	const validationMenuOtherUrl = computed(() => [
		() =>
			menudata.value?.otherUrl == "" ||
			/^\/(?!\/)[\w\-.\s/]+$/.test(menudata.value?.otherUrl ?? "") ||
			validator.isURL(menudata.value?.otherUrl ?? "", {
				protocols: ["http", "https"],
				require_protocol: false,
				allow_protocol_relative_urls: true, // //example.com
			}) ||
			"Špatný formát URL adresy.",
	]);

	const currentNameSlug = computed(() => createSlug(menudata.value?.name));
	const currentSlug = computed(() => {
		if (menudata.value?.url === "/") return "/";
		return (
			(pickMenuTreeActivated.value[0].id !== 0
				? pickMenuTreeActivated.value[0].url
				: "") + currentNameSlug.value
		);
	});

	const changeArticleWidgetProperty = (a: any, b: any, c: any) => {};
	const changeWidgetPosition = (a: any, b: any, c: any) => {};
	const deleteWidget = (a: any, b: any) => {};

	const menuSlugValidation = () => {
		let children =
			pickMenuTreeActivated.value[0].id !== 0
				? pickMenuTreeActivated.value[0].children
				: menus.value;

		return !children?.find(
			(e) => e.url === currentSlug.value && e.id != menudata.value?.id
		);
	};

	const createSlug = (string: string | null | undefined) => {
		let slug = "/";
		if (!string) return slug;
		slug += slugify(string, { lower: true, strict: true });
		return slug;
	};

	const changePositionDragged = async (changed: any, list: any) => {
		if (!(await changeWidgetsOrder(changed))) {
			revertDraggable(changed, list);
		}
	};

	const changeDraggablePositionProgramatically = (
		newIndex: any,
		oldIndex: any,
		list: any
	) => {
		let tmpList = list.splice(newIndex, 1);
		list.splice(oldIndex, 0, tmpList[0]);
	};
	const revertDraggable = (changed: any, list: any) => {
		changeDraggablePositionProgramatically(
			changed.moved.newIndex,
			changed.moved.oldIndex,
			list
		);
	};

	import { useWidgetsStore } from "~/store/widgets";
	const widgets = useWidgetsStore();
	const getWidget = (widgetId: number) => {
		return widgets.$state.globalData.find((e) => e.id === widgetId);
	};

	const changeWidgetsOrder = async (changed: any) => {
		return true;
		// changed = vuedraggable object {moved: {element: element, newIndex: 1, oldIndex: 0}}
		// this.$axios({
		// 	method: "put",
		// 	url: "/api/articleswidgets/changeorder",
		// 	data: {
		// 		formdata: {
		// 			articlesWidgets: {
		// 				ArticleId: this.article.id,
		// 				id: changed.moved.element.id,
		// 				newOrder: changed.moved.newIndex,
		// 			},
		// 		},
		// 	},
		// })
		// .then(async (response) => {
		// 	this.$store.dispatch("setSnackBars", {
		// 		text: `Pořadí bylo změněno.`,
		// 		icon: "check",
		// 		color: "light-green",
		// 	});
		// 	this.getArticle();
		// 	return true;
		// })
		// .catch((error) => {
		// 	this.$store.dispatch("setSnackBars", {
		// 		text: "Něco se pokazilo.",
		// 		icon: "alert-circle-outline",
		// 		color: "red",
		// 	});
		// 	this.disableForm = false;
		// 	return false;
		// });
	};
</script>
