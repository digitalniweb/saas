<template>
	<v-row no-gutters>
		<v-col cols="12" md="5">
			<v-card>
				<v-card-title>
					{{ translate("Edit menu") }}
				</v-card-title>
				<v-card-text>
					<v-alert
						icon="mdi-help-circle-outline"
						border="start"
						class="mb-3"
						density="compact"
					>
						<v-tooltip location="bottom">
							<template v-slot:activator="{ props }">
								<v-icon
									color="blue"
									v-bind="props"
									class="mr-2"
								>
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
					</v-alert>
					<v-treeview
						:items="menus ?? []"
						density="compact"
						activatable
						item-value="id"
						item-title="name"
						return-object
						:activated="menuTreeActivated"
						v-model:opened="menuTreeOpened"
						@update:activated="
							activatedChanged as Partial<
								InferAttributes<Article>
							>
						"
						class="py-0"
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
					<v-btn
						prepend-icon="mdi-plus"
						:text="translate('Add menu')"
						color="green"
						block
						class="my-5"
						@click="createNewMenu"
						:disabled="newMenuActive"
					></v-btn>
				</v-card-text>
			</v-card>
		</v-col>
		<!-- <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>
		<v-divider class="my-4 d-block d-md-none"></v-divider> -->
		<v-spacer></v-spacer>

		<v-col cols="12" md="6">
			<v-scroll-x-transition origin="center right">
				<v-form ref="form">
					<v-card v-show="menuTreeActivated.length > 0">
						<v-tabs
							v-model="tab"
							align-tabs="center"
							bg-color="basil"
							stacked
							grow
						>
							<v-tab value="tab-assignment">
								<v-icon
									icon="mdi-format-list-numbered"
								></v-icon>
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
										{{ menuTreeActivated[0]?.name }}
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
											:disabled="indexMenuActivated"
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
								style="left: 20px"
								size="small"
								:disabled="indexMenuActivated"
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
										item-value="id"
										@update:model-value="
											(el) =>
												orderChanged(el as orderType)
										"
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
											<template
												v-slot:activator="{ props }"
											>
												<v-icon
													icon="mdi-help-circle"
													class="cursor-help"
													v-bind="props"
												/>
											</template>
											<span
												v-html="
													translate(
														'MenuParentTooltip'
													)
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
										v-model:opened="pickMenuTreeOpened"
										:activated="pickMenuTreeActivated"
										@update:activated="
											activatedChangedPickedMenu as menuTreeNode
										"
										:disabled="indexMenuActivated"
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
										v-model="menudata.otherUrl"
										icon="mdi-alpha-u"
										icon-button="mdi-file"
										:rules="validationMenuOtherUrl"
										name="Other URL"
										:translation="translations"
										:disabled="indexMenuActivated"
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
												v-model="menudata.icon"
											></CustomFormPickIcon>
										</template>
									</v-text-field>
									<customFormPickFiles
										v-model="menudata.image"
									/>
								</v-card>
							</v-tabs-window-item>
							<v-tabs-window-item :value="'tab-article'">
								<v-card v-if="widgetsdata" class="pa-5">
									<v-alert
										icon="mdi-help-circle-outline"
										border="start"
										class="mb-3"
										density="compact"
										v-if="widgetsdata.length === 0"
									>
										{{ translate("AddWidgetInfo") }}
									</v-alert>
									<v-alert
										icon="mdi-help-circle-outline"
										border="start"
										class="mb-3"
										density="compact"
										v-else-if="widgetsdata.length > 1"
									>
										{{ translate("UseMouseToDragWidgets") }}
									</v-alert>
									<draggable
										v-model="widgetsdata"
										@change="changePositionDragged"
										item-key="id"
									>
										<template
											#item="{
												element: widgetContent,
												index: i,
											}: {
												element: ArticleWidget;
												index: number;
											}"
										>
											<v-list-item
												variant="elevated"
												class="mb-1"
											>
												<template v-slot:prepend>
													<v-switch
														class="mr-1"
														v-model="
															widgetContent.active
														"
														color="green"
														:hide-details="true"
														@change="
															changeArticleWidgetProperty(
																$event,
																'active',
																widgetContent
															)
														"
													></v-switch>
													<v-icon
														:icon="
															widgets.getWidgetById(
																widgetContent.widgetId
															)?.icon ||
															'mdi-cube'
														"
													>
													</v-icon>
												</template>
												<template v-slot:default>
													<v-list-item-title
														v-text="
															widgets.getWidgetsContentTitle(
																widgetContent
															)
														"
													></v-list-item-title>
												</template>
												<template v-slot:append>
													<v-list-item-action>
														<v-btn
															icon="mdi-chevron-up"
															size="x-small"
															:disabled="i === 0"
															v-if="
																widgetsdata.length >
																1
															"
															@click="
																changeWidgetPosition(
																	'up',
																	i,
																	widgetContent
																)
															"
														/>
														<v-btn
															class="mr-1"
															icon="mdi-chevron-down"
															size="x-small"
															:disabled="
																i ===
																widgetsdata.length -
																	1
															"
															v-if="
																widgetsdata.length >
																1
															"
															@click="
																changeWidgetPosition(
																	'down',
																	i,
																	widgetContent
																)
															"
														/>
														<v-btn
															class="mr-1"
															size="x-small"
															color="blue-lighten-5"
															icon="mdi-pencil"
															@click="
																editArticleWidgetContent(
																	widgetContent
																)
															"
														/>
														<v-btn
															size="x-small"
															color="red"
															icon="mdi-delete-outline"
															@click="
																deleteWidget(i)
															"
														/>
													</v-list-item-action>
												</template>
											</v-list-item>
										</template>
									</draggable>
									<v-btn
										prepend-icon="mdi-plus"
										:text="translate('Add widget')"
										color="green"
										block
										class="my-5"
										@click="openChooseWidget"
									></v-btn>
								</v-card>
							</v-tabs-window-item>
						</v-tabs-window>
					</v-card>
				</v-form>
			</v-scroll-x-transition>
		</v-col>
	</v-row>
	<AdminBlocksPickWidget
		v-model="chooseWidgetDialog"
		:moduleName="moduleName"
		@widgetSelected="widgetSelected"
	/>
	<AdminBlocksEditArticleWidgetContent
		v-model="editArticleWidgetContentDialog"
		:widget="pickedWidget"
		:article-widget="pickedWidgetContent"
		@returnWidgetContent="returnedWidgetContent"
	/>
</template>
<style>
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
	const translations = {
		"Main menu": {
			cs: "Hlavní menu",
		},
		"Web menu": {
			cs: "Menu webu",
		},
		"Add menu": {
			cs: "Přidat menu",
		},
		"Add widget": {
			cs: "Přidat widget",
		},
		"Edit menu": {
			cs: "Upravit menu",
		},
		"Menu was successfully saved": {
			cs: "Menu bylo úspěšně uloženo",
		},
		"Menu was edited": {
			cs: "Menu bylo upraveno",
		},
		"Menu was deleted": {
			cs: "Menu bylo smazáno",
		},
		"Please change menu's name": { cs: "Prosím změňte název menu" },
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
		MenuLocationFail: {
			en: "You cannot assign a menu to itself.",
			cs: "Nemůžete zařadit menu do sebe sama.",
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
		"New menu": {
			cs: "Nové menu",
		},
		MenuDownloadFail: {
			en: "Failed to download menu.",
			cs: "Nepodařilo se stáhnout menu.",
		},
	};

	const { translate } = useTranslations(translations);

	// import { VTreeview } from "vuetify/labs/VTreeview";
	import slugify from "slugify";
	import draggable from "vuedraggable";

	import type { InferAttributes } from "sequelize";
	import { useSnackBarsStore } from "~/store/snackBars";
	import getObjectFromArray from "~~/digitalniweb-custom/functions/getObjectFromArray";
	import type {
		buildTreeType,
		TreeNode,
	} from "~~/digitalniweb-custom/helpers/buildTree.ts";
	import type {
		Article,
		ArticleWidget,
	} from "~~/digitalniweb-types/models/content";
	const snackBars = useSnackBarsStore();

	import validator from "validator";

	import { useConfirmStore } from "~/store/confirm";
	const confirmStore = useConfirmStore();

	import { useCurrentPageStore } from "~/store/currentPage";
	const currentPage = useCurrentPageStore();

	const menuSlugValidation = () => {
		let children =
			pickMenuTreeActivated.value[0].id !== -1
				? pickMenuTreeActivated.value[0].children
				: menus.value;

		return !children?.find(
			(e) => e.url === currentSlug.value && e.id != menudata.value?.id
		);
	};

	const createSlug = (string: string | null | undefined) => {
		if (!string) return "";
		let slug = slugify(string, { lower: true, strict: true });
		if (slug === "") return "";
		return "/" + slug;
	};

	// this assure opened tree after saving menu
	const menuTreeOpened = ref([]);
	const pickMenuTreeOpened = ref([]);

	// for assigning menu to root
	const pickMenuRootObject = {
		id: -1,
		name: translate("Main menu"),
		order: -1,
		url: "/",
	};

	// import { useWebsiteStore } from "~/store/website";
	// const websiteStore = useWebsiteStore();
	const newMenuString = ref(translate("New menu"));
	const newMenuDefault = {
		name: newMenuString.value,
		id: 0,
		parentId: null,
		title: newMenuString.value,
		description: "",
		active: true,
		languageId: currentPage.language?.id,
		otherUrl: "",
		freeMenu: false,
		// use API injected values instead
		// websiteId: websiteStore.$state.data?.id,
		// websitesMsId: websiteStore.$state.data?.websitesMsId, // this doesn't work anyways
		url: createSlug(newMenuString.value),
	} as Partial<InferAttributes<Article>>;

	const chooseWidgetDialog = ref(false);
	const openChooseWidget = async () => {
		chooseWidgetDialog.value = true;
	};

	const editArticleWidgetContentDialog = ref(false);

	const { fetchData } = useApiCall();

	const pickedWidgetContent = ref<InferAttributes<ArticleWidget> | null>(
		null
	);

	const menus = ref<buildTreeType<
		InferAttributes<Article> | Partial<InferAttributes<Article>>
	> | null>(null);
	menus.value =
		(await fetchData<buildTreeType<InferAttributes<Article>> | null>(
			"/api/website/admin/menu"
		)) ?? [];

	if (menus.value.length === 0)
		snackBars.setSnackBar({
			color: "error",
			text: translate("MenuDownloadFail"),
		});

	const pickMenuTreeActivated = ref<menuTreeNode[]>([]);

	const selectedOrder = ref<menuTreeNode | null>(null);

	const menuTreeActivated = ref<menuTreeNode[]>([]);

	const pickedWidget = ref<InferAttributes<Widget> | null>(null);

	const widgetSelected = (widget: InferAttributes<Widget>) => {
		pickedWidget.value = widget;
		editArticleWidgetContentDialog.value = true;
	};

	const editArticleWidgetContent = (
		widgetContent: InferAttributes<ArticleWidget>
	) => {
		if (!pickedWidget.value)
			pickedWidget.value =
				widgets.getWidgetById(widgetContent.widgetId) ?? null;

		pickedWidgetContent.value = widgetContent;
		editArticleWidgetContentDialog.value = true;
	};

	import { useModulesStore } from "~/store/modules";
	const modules = useModulesStore();

	const moduleName = "articles" as modules;
	// const currentModule = modules.globalData.find((e) => e.name === moduleName);
	// I should do some error handling here, because "currentModule" should must exist

	const returnedWidgetContent = (
		newInfoWidgetContent:
			| newWidgetContent
			| InferAttributes<ArticleWidget>
			| null
	) => {
		if (!pickedWidget.value || !newInfoWidgetContent) {
			pickedWidgetContent.value = null;
			pickedWidget.value = null;
			return;
		}
		pickedWidget.value =
			widgets.getWidgetById(pickedWidget.value.id) ?? null;

		if (!pickedWidgetContent.value) {
			let newWidgetContent = {
				...newInfoWidgetContent,
				order: widgetsdata.value?.length || 0,
				// moduleId: currentModule?.id,
				widgetId: pickedWidget.value?.id,
			} as newWidgetContent;
			widgetsdata.value?.push(newWidgetContent);
		} else {
			for (const key in newInfoWidgetContent) {
				if (
					Object.prototype.hasOwnProperty.call(
						newInfoWidgetContent,
						key
					)
				) {
					// @ts-ignore
					pickedWidgetContent.value[key] = newInfoWidgetContent[key];
				}
			}
		}
		pickedWidgetContent.value = null;
		pickedWidget.value = null;
	};

	const indexMenuActivated = computed(
		() => menuTreeActivated.value?.[0]?.url === "/"
	);

	let formDataFunctions = useFormData();

	const formdataOriginalWidgetContent = ref<InferAttributes<ArticleWidget>[]>(
		[]
	);
	const menudata = ref<InferAttributes<Article> | null>(null);
	const widgetsdata = ref<
		(InferAttributes<ArticleWidget> | newWidgetContent)[] | null
	>(null);

	type menuTreeNode = TreeNode<Partial<InferAttributes<Article>>>;

	const newMenuActive = ref(false);
	const createNewMenu = () => {
		newMenuActive.value = true;
		let newMenu = formDataFunctions.cloneData(newMenuDefault);
		newMenu.order = menus.value?.length ?? 0;
		menus.value?.push(newMenu);
		menuTreeActivated.value = [newMenu];

		pickMenuTreeActivated.value = [pickMenuRootObject];
		menudata.value = newMenu as InferAttributes<Article>;

		formdataOriginalWidgetContent.value = [];
		widgetsdata.value = [];
		createMenuOrder();
	};

	const tab = ref(null);

	// currently picked Menu's order
	const pickMenuOrder = ref<menuTreeNode[]>([]);
	const firstOrder = {
		title: "1",
		name: translate("As first"),
		order: 0,
		id: -1,
	};
	const createMenuOrder = (selectFirst = false) => {
		let orderOptions = [firstOrder] as menuTreeNode[];
		if (selectFirst) selectedOrder.value = firstOrder;
		let currentParentId = menuTreeActivated.value[0]?.parentId ?? -1;

		let menuOrderOptions = [] as menuTreeNode[];

		let pickedLevelMenus = [] as menuTreeNode[];
		if (pickMenuTreeActivated.value[0]?.id === -1) {
			// top level menus
			pickedLevelMenus = menus.value ?? [];
		} else if (pickMenuTreeActivated.value[0]?.children) {
			pickedLevelMenus = pickMenuTreeActivated.value[0].children;
		} else pickedLevelMenus = [];

		let pickedMenuParentId = pickMenuTreeActivated.value[0].id;
		pickedLevelMenus.forEach((el, i) => {
			let currentOrderOption = {
				title: (i + 2).toString(),
				name: el.name,
				order: (el?.order ?? 0) + 1,
				id: el.id,
			};

			// if changing order inside same menu
			if (currentParentId === pickedMenuParentId) {
				if (i > (menuTreeActivated.value[0].order ?? 0)) {
					currentOrderOption.title = (
						parseInt(currentOrderOption.title) - 1
					).toString();
					currentOrderOption.order--;
				}

				if (i === menuTreeActivated.value[0].order) {
					if (i === 0) {
						selectedOrder.value = orderOptions[0];
					} else {
						selectedOrder.value = menuOrderOptions[i - 1];
					}
					return;
				}
			}
			menuOrderOptions.push(currentOrderOption);

			// if putting menu inside other menu then put it to the end
			if (
				currentParentId !== pickedMenuParentId &&
				i == pickedLevelMenus.length - 1
			) {
				selectedOrder.value = menuOrderOptions[i];
			}
		});

		orderOptions.push(...menuOrderOptions);

		pickMenuOrder.value = orderOptions;
		orderChanged(selectedOrder.value as orderType);
	};

	import { useMenusStore } from "~/store/menus";
	const menusStore = useMenusStore();

	const createWebMenus = (array?: menuTreeNode[]) => {
		let root = false;
		if (!array) {
			array = structuredClone(toRaw(menus.value)) ?? [];
			root = true;
		}

		for (let index = 0; index < array.length; index++) {
			const el = array[index];
			if (el.deletedAt || !el.active) {
				array.splice(index, 1);
				continue;
			}
			if (el.children && el.children.length > 0)
				createWebMenus(el.children);
		}

		if (!root) return array;

		menusStore.articles = array as buildTreeType<InferAttributes<Article>>;
	};

	const deleteCurrentMenu = async () => {
		if (!menuTreeActivated.value[0]) return;
		if (!menus.value) return;
		if (menuTreeActivated.value[0].id === 0) {
			// new menu
			let response = await confirmStore.open(
				translate("DiscardChanges"),
				"",
				{
					width: 400,
					type: "yesNo",
				}
			);
			if (!response) return;

			menus.value?.pop();
			newMenuActive.value = false;
			menuTreeActivated.value.pop();
			return;
		}

		let response = await confirmStore.open(translate("Delete?"), "", {
			width: 400,
			type: "yesNo",
		});
		if (!response) return;

		let menuLocation = [] as menuTreeNode[];
		let menuLocationParent = null as menuTreeNode | null; // null = root

		if (menuTreeActivated.value[0].parentId === null)
			menuLocation = menus.value;
		else {
			let foundMenu = getObjectFromArray<menuTreeNode>(
				menuTreeActivated.value[0].parentId,
				menus.value
			);
			if (foundMenu && foundMenu.children) {
				menuLocation = foundMenu.children;
				menuLocationParent = foundMenu;
			}
		}
		if (menuLocation === undefined) {
			snackBars.setSnackBar({
				color: "error",
				text: translate("Something went wrong"),
			});
			return false;
		}

		let menuDeleted = await fetchData<Article | false>(
			"/api/content/admin/article",
			{
				disableBody: true,
				method: "DELETE",
				body: {
					id: menuTreeActivated.value[0].id,
				} as deleteArticleRequestBody,
			}
		);
		if (!menuDeleted) {
			snackBars.setSnackBar({
				color: "error",
				text: translate("Something went wrong"),
			});
			return false;
		}

		snackBars.setSnackBar({
			color: "success",
			text: translate("Menu was deleted"),
		});

		menuLocation.splice(menuTreeActivated.value[0].order!, 1);

		if (menuLocation.length > 0)
			changeObjectsOrderFrom(
				menuTreeActivated.value[0].order!,
				menuLocation as []
			);
		else delete menuLocationParent?.children;

		menuTreeActivated.value.pop();
		formdataOriginalWidgetContent.value = [];
		widgetsdata.value = [];
		menudata.value = null;

		createWebMenus();
	};

	/**
	 *
	 * @param array
	 * @param indexFrom
	 * @param changedId
	 * @param includingFrom
	 */
	const getchangedOrdersIds = <T extends orderDataObject>(
		array: T[],
		indexFrom: number,
		changedId: number = -1,
		includingFrom: boolean = false
	): orderDataObject[] => {
		let result = [] as orderDataObject[];
		let newOrder = indexFrom;
		if (includingFrom === false) newOrder += 1;
		for (let index = indexFrom; index < array.length; index++) {
			let current = array[index];
			if (current.id === changedId) continue;
			result.push({
				id: current.id,
				order: newOrder,
				parentId: current.parentId,
			});
			newOrder++;
		}
		return result;
	};

	import { VForm } from "vuetify/components";
	const form = ref<VForm | null>(null);

	const saveCurrentMenu = async () => {
		// menu
		if (!form.value) return;
		if (!menus.value?.length) return;
		if (!menuTreeActivated.value[0] || !menudata.value) return;

		//validate changes
		let validate = await form.value?.validate();
		if (validate.errors.length > 0) {
			snackBars.setSnackBar({
				color: "warning",
				text: translate("FormValidationError"),
			});
			return;
		}

		let menuIsNew = false;

		let menuChangedLocation = false; // existing menu changed order on same location
		let menuChangedLocationToOtherMenu = false; // existing menu changed location (and therefor order as well)

		let originalMenuLocation = [] as menuTreeNode[];
		let newMenuLocation = [] as menuTreeNode[];
		let originalMenuLocationParent = null as null | menuTreeNode;
		let newMenuLocationParent = null as null | menuTreeNode;
		let originalParentId = menuTreeActivated.value[0].parentId;
		let newParentId = menudata.value.parentId;
		if (originalParentId === null) originalMenuLocation = menus.value;
		else {
			let foundMenu = getObjectFromArray<menuTreeNode>(
				originalParentId,
				menus.value
			);
			if (foundMenu) {
				originalMenuLocationParent = foundMenu;
				if (foundMenu.children)
					originalMenuLocation = foundMenu.children;
			}
		}
		if (originalMenuLocation === undefined) {
			snackBars.setSnackBar({
				color: "error",
				text: translate("Something went wrong"),
			});
			return false;
		}

		if (newParentId === null) newMenuLocation = menus.value;
		else if (originalParentId === newParentId)
			newMenuLocation = originalMenuLocation;
		else {
			let foundMenu = getObjectFromArray<menuTreeNode>(
				newParentId,
				menus.value
			);
			if (foundMenu === false) {
				snackBars.setSnackBar({
					color: "error",
					text: translate("Something went wrong"),
				});
				return false;
			}
			newMenuLocationParent = foundMenu;
			if (foundMenu.children === undefined) foundMenu.children = [];
			newMenuLocation = foundMenu.children;
		}

		let newMenuUrls: urlDataObject[] = [];
		if (menudata.value?.id === 0) {
			// new menu
			menuIsNew = true;
			if (menudata.value.name == translate("New menu")) {
				snackBars.setSnackBar({
					color: "orange",
					text: translate("Please change menu's name"),
				});
				return false;
			}
		} else {
			// already existing menu
			if (originalParentId === newParentId) {
				// only order was changed on same level
				if (menuTreeActivated.value[0].order !== menudata.value.order)
					menuChangedLocation = true;
			} else {
				// menu was put inside another one
				menuChangedLocationToOtherMenu = true;
			}

			// change urls of children if location was changed
			if (menudata.value.url !== menuTreeActivated.value[0].url)
				newMenuUrls = updateChildrenUrls(
					menuTreeActivated.value[0],
					menudata.value.url
				);
		}

		if (menuIsNew) {
			let newWCs = [] as newWidgetContent[];
			newWCs = widgetsdata.value || [];

			let menudataSave: Partial<InferAttributes<Article>>;
			menudataSave = { ...menudata.value };
			delete menudataSave.id;

			let newMenuCreated = await fetchData<Article | false>(
				"/api/content/admin/article",
				{
					disableBody: true,
					method: "PUT",
					body: {
						menu: menudataSave,
						widgets: {
							new: newWCs,
						},
					} as saveNewArticleRequestBody,
				}
			);
			if (!newMenuCreated) {
				snackBars.setSnackBar({
					color: "error",
					text: translate("Something went wrong"),
				});
				return false;
			}

			newMenuLocation.splice(newMenuCreated.order, 0, newMenuCreated);

			changeObjectsOrderFrom(
				newMenuCreated.order,
				newMenuLocation as buildTreeType<InferAttributes<Article>>
			);

			menuTreeActivated.value.pop();
			menus.value?.pop();
			newMenuActive.value = false;

			if (newMenuCreated) {
				menudata.value = formDataFunctions.cloneData(newMenuCreated);
				menuTreeActivated.value.push(newMenuCreated);

				if (newMenuCreated.ArticleWidgets) {
					formdataOriginalWidgetContent.value =
						newMenuCreated.ArticleWidgets;
					widgetsdata.value = formDataFunctions.cloneData(
						newMenuCreated.ArticleWidgets
					);
					// delete newMenuCreated.ArticleWidgets;
				}
			}
			createMenuOrder();

			snackBars.setSnackBar({
				color: "success",
				text: translate("Menu was successfully saved"),
			});
		} else {
			// edit menu

			//  menu's WidgetContent - create new / edited / deleted
			let deletedWCs = [] as number[];
			let newWCs = [] as newWidgetContent[];
			let editedWCs = [] as Partial<InferAttributes<ArticleWidget>>[];

			let newWidgetContentData = [] as (
				| InferAttributes<ArticleWidget>
				| newWidgetContent
			)[];
			if (widgetsdata.value)
				newWidgetContentData = [...widgetsdata.value];

			formdataOriginalWidgetContent.value.forEach((wc) => {
				let indexWC = newWidgetContentData.findIndex((el) => {
					if ("id" in el && wc.id === el?.id) return true;
				});
				if (indexWC === -1) {
					deletedWCs.push(wc.id);
					return;
				}

				let editCandidateWC = newWidgetContentData[
					indexWC
				] as InferAttributes<ArticleWidget>;

				let diff = formDataFunctions.dataDifference(
					wc,
					editCandidateWC
				);

				if (Object.keys(diff).length > 0) {
					// widgetContent.options is json which I want to save whole, not just a difference
					let widgetModelName = widgets.getWidgetById(wc.id)?.model;
					if (widgetModelName && diff?.[widgetModelName]?.options) {
						diff[widgetModelName].options =
							editCandidateWC[widgetModelName]?.options;
					}
					editedWCs.push({
						...diff,
						// moduleId: currentModule?.id,
						id: editCandidateWC.id,
					});
				}
				newWidgetContentData.splice(indexWC, 1);
			});
			newWCs = newWidgetContentData;

			let menudataSave: menuTreeNode;
			menudataSave = formDataFunctions.dataDifference(
				menuTreeActivated.value[0],
				menudata.value
			);

			delete menudataSave.children;

			// check if any change was made
			if (
				!Object.keys(menudataSave).length &&
				!deletedWCs.length &&
				!editedWCs.length &&
				!newWCs.length
			) {
				snackBars.setSnackBar({
					color: "orange",
					text: translate("NoChangeMade"),
				});
				return false;
			}

			let id = menudata.value.id;
			let menuUpdated = await fetchData<Article | false>(
				"/api/content/admin/article",
				{
					disableBody: true,
					method: "PATCH",
					body: {
						menu: {
							id,
							data: menudataSave,
							newMenuUrls,
						},
						widgets: {
							deletedWCs,
							newWCs,
							editedWCs,
						},
					} as editArticleRequestBody,
				}
			);

			if (!menuUpdated) {
				snackBars.setSnackBar({
					color: "error",
					text: translate("Something went wrong"),
				});
				return false;
			}

			if (menuChangedLocation || menuChangedLocationToOtherMenu) {
				let originalOrder = menuTreeActivated.value[0].order!;
				let newOrder = menuUpdated.order;

				let tmpList = originalMenuLocation?.splice(originalOrder, 1);
				tmpList[0].parentId = menuUpdated.parentId;
				tmpList[0].order = newOrder;

				newMenuLocation?.splice(newOrder, 0, tmpList[0]);
				if (menuChangedLocation) {
					changeObjectsOrderRange(
						originalOrder,
						newOrder,
						newMenuLocation as []
					);
				} else if (menuChangedLocationToOtherMenu) {
					changeObjectsOrderFrom(
						originalOrder,
						originalMenuLocation as []
					);

					changeObjectsOrderFrom(newOrder + 1, newMenuLocation as []);
				}
				menuTreeActivated.value.pop();
				menuTreeActivated.value.push(tmpList[0]);
			}

			let key: keyof Partial<Article>;
			for (key in menuUpdated) {
				if (Object.prototype.hasOwnProperty.call(menuUpdated, key)) {
					if (
						menuUpdated[key] !== undefined &&
						key in menuTreeActivated.value[0]
					) {
						(menuTreeActivated.value[0] as any)[key] =
							menuUpdated[key];
					}
				}
			}

			if (menuUpdated) {
				menudata.value = formDataFunctions.cloneData(
					menuTreeActivated.value[0] as Article
				);

				if (menuUpdated.ArticleWidgets) {
					formdataOriginalWidgetContent.value =
						menuUpdated.ArticleWidgets;
					widgetsdata.value = formDataFunctions.cloneData(
						menuUpdated.ArticleWidgets
					);
					delete menuUpdated.ArticleWidgets;
				}
			}

			createMenuOrder();

			snackBars.setSnackBar({
				color: "success",
				text: translate("Menu was edited"),
			});
		}
		if (newMenuLocation.length === 0)
			delete newMenuLocationParent?.children;
		if (originalMenuLocation.length === 0)
			delete originalMenuLocationParent?.children;
	};

	/**
	 *
	 * @param parent
	 * @param parentUrl
	 * @param mutate if true mutates `parent` otherwise just return new children's urls
	 */
	const updateChildrenUrls = (
		parent: menuTreeNode,
		parentUrl: string,
		mutate: boolean = false
	): urlDataObject[] => {
		if (!parent.children) return [];
		let updatedUrls: urlDataObject[] = [];
		parent.children.forEach((child) => {
			if (!child.id) return;
			const newUrl = `${parentUrl}${createSlug(child.name)}`;
			if (mutate) {
				child.url = newUrl;
			}
			updatedUrls.push({ id: child.id, url: newUrl });
			updatedUrls = updatedUrls.concat(
				updateChildrenUrls(child, newUrl, mutate)
			);
		});
		return updatedUrls;
	};

	type orderType = {
		name: string;
		order: number;
		url: string;
	};
	const orderChanged = (el: orderType) => {
		if (menudata.value) menudata.value.order = el.order;
	};

	const activatedChanged = async (e: menuTreeNode[]) => {
		// even though it returns array it can contain only 1 activated menu
		if (e.length === 0) return;

		if (newMenuActive.value) {
			// assure user he wants to cancel his "new menu creation"
			let response = await confirmStore.open(
				translate("DiscardChanges"),
				"",
				{
					width: 400,
					type: "yesNo",
				}
			);
			if (!response) return;
			if (menus.value?.[menus.value.length - 1].id === 0)
				menus.value?.splice(menus.value.length - 1, 1);
			newMenuActive.value = false;
		}

		menuTreeActivated.value = e;
		if (e[0].parentId == null) {
			pickMenuTreeActivated.value = [pickMenuRootObject];
		} else if (menus.value) {
			let parentObj = getObjectFromArray<menuTreeNode>(
				e[0].parentId,
				menus.value
			);
			if (parentObj) pickMenuTreeActivated.value = [parentObj];
		}

		const data = await fetchData<InferAttributes<Article> | null>(
			"/api/content/admin/article",
			{
				params: {
					url: menuTreeActivated.value[0]?.url ?? "/",
				},
			}
		);

		if (data) {
			menudata.value = formDataFunctions.cloneData(data);
			if (menudata.value?.ArticleWidgets) {
				formdataOriginalWidgetContent.value =
					menudata.value.ArticleWidgets;
				widgetsdata.value = formDataFunctions.cloneData(
					formdataOriginalWidgetContent.value
				);
				delete menudata.value.ArticleWidgets;
			}
		}

		createMenuOrder();
	};

	const activatedChangedPickedMenu = (e: menuTreeNode[]) => {
		let currentMenuId = menuTreeActivated.value[0]?.id;

		let currentPickMenuId = pickMenuTreeActivated.value[0]?.id;
		let clickedPickMenuId = e[0]?.id;

		if (clickedPickMenuId === undefined) return;
		if (currentPickMenuId === clickedPickMenuId) return;

		if (currentMenuId === clickedPickMenuId) {
			snackBars.setSnackBar({
				color: "warning",
				text: translate("MenuLocationFail"),
			});
			return;
		}

		let child = findMenuTreeNodeById(
			menuTreeActivated.value[0],
			clickedPickMenuId
		);
		if (child) {
			snackBars.setSnackBar({
				color: "warning",
				text: translate("MenuLocationFail"),
			});
			return;
		}

		if (menudata.value)
			menudata.value.parentId = e[0].id === -1 ? null : e[0].id || null;
		pickMenuTreeActivated.value = e;
		createMenuOrder(true);

		// trigger computed currentSlug
		currentSlug.value;
	};

	const findMenuTreeNodeById = (
		obj: menuTreeNode,
		id: number
	): menuTreeNode | null => {
		if (obj.id === id) {
			return obj;
		}
		if (obj.children) {
			for (let child of obj.children) {
				let result = findMenuTreeNodeById(child, id);
				if (result) {
					return result;
				}
			}
		}
		return null;
	};

	const pickMenuTree = computed(() => {
		return [
			pickMenuRootObject,
			...(menus.value?.filter((e) => e.url !== "/") ?? []),
		];
	});

	const validationMenuNameRules = computed(() => [
		() => !!menudata.value?.name || translate("Fill in this field"),
		() =>
			createSlug(menudata.value?.name) !== "" ||
			translate("Fill in this field"),
		() =>
			menuSlugValidation() ||
			"Menu se shodným URL již existuje! Změňte prosím název.",
	]);

	const validationMenuOtherUrl = computed(() => [
		() =>
			!menudata.value?.otherUrl ||
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
		let slug =
			(pickMenuTreeActivated.value[0].id !== -1
				? pickMenuTreeActivated.value[0].url
				: "") + currentNameSlug.value;
		if (menudata.value) menudata.value.url = slug;
		return slug;
	});

	const changeArticleWidgetProperty = (a: any, b: any, c: any) => {};
	const changeWidgetPosition = (
		way: "up" | "down",
		index: number,
		widget: ArticleWidget
	) => {
		let changed = {
			moved: {
				element: widget,
				newIndex: way == "up" ? index - 1 : index + 1,
				oldIndex: index,
			},
		};
		changeDraggablePositionProgramatically(changed.moved.newIndex, index);
		changeWidgetsOrder(changed);
	};

	const deleteWidget = async (index: number) => {
		let response = await confirmStore.open(translate("Delete?"), "", {
			width: 400,
			type: "yesNo",
		});
		if (!response) return;
		widgetsdata.value?.splice(index, 1);

		// reorder widgets' `order` property if there is any widget left
		if (widgetsdata.value?.length)
			changeObjectsOrderFrom(index, widgetsdata.value);
	};

	type draggablePositionChanged<T> = {
		moved: {
			element: T;
			newIndex: number;
			oldIndex: number;
		};
	};
	const changePositionDragged = (
		changed: draggablePositionChanged<ArticleWidget>
	) => {
		if (!changeWidgetsOrder(changed)) {
			revertDraggable(changed);
		}
	};

	const changeDraggablePositionProgramatically = (
		newIndex: number,
		oldIndex: number
	) => {
		let tmpList = widgetsdata.value?.splice(newIndex, 1);
		if (tmpList) widgetsdata.value?.splice(oldIndex, 0, tmpList[0]);
	};
	const revertDraggable = (
		changed: draggablePositionChanged<ArticleWidget>
	) => {
		changeDraggablePositionProgramatically(
			changed.moved.newIndex,
			changed.moved.oldIndex
		);
	};

	import type {
		deleteArticleRequestBody,
		editArticleRequestBody,
		orderDataObject,
		saveNewArticleRequestBody,
		urlDataObject,
	} from "~~/digitalniweb-types/apps/communication/modules/articles";
	import type { modules } from "~~/digitalniweb-types/functionality/modules";
	import type { Widget } from "~~/digitalniweb-types/models/globalData";
	import type { newWidgetContent } from "../../blocks/EditArticleWidgetContent.vue";

	import { useWidgetsStore } from "~/store/widgets";
	const widgets = useWidgetsStore();

	const changeWidgetsOrder = (
		changed: draggablePositionChanged<ArticleWidget>
	) => {
		if (widgetsdata.value)
			changeObjectsOrderRange(
				changed.moved.oldIndex,
				changed.moved.newIndex,
				widgetsdata.value
			);
		return true;
	};

	/**
	 * Mutates array
	 * Changes element's index from fromIndex to toIndex
	 * @param {number} fromIndex - The index of the element to move.
	 * @param {number} toIndex - The target index to move the element to.
	 * @param {any[]} array - The array containing the elements to move.
	 * @returns {boolean} - Returns `true` if the operation is successful, or `false` if indices are out of bounds.
	 */
	function changeArrayOrder(
		fromIndex: number,
		toIndex: number,
		array: any[]
	): boolean {
		if (
			fromIndex < 0 ||
			toIndex < 0 ||
			fromIndex >= array.length ||
			toIndex >= array.length
		) {
			return false;
		}
		const [item] = array.splice(fromIndex, 1); // Remove the item at `fromIndex`
		array.splice(toIndex, 0, item); // Insert the item at `toIndex`
		return true;
	}

	/**
	 * Updates a specified numeric property (e.g., "order") from 'fromIndex' to end. Can be used after deletion or addition of object to array.
	 * @param fromIndex
	 * @param array
	 * @param property
	 */
	function changeObjectsOrderFrom<
		T extends Record<string, any> & { [key in P]: number },
		P extends string = "order",
	>(
		fromIndex: number,
		array: T[],
		property: P = "order" as P,
		startingNumber: number | false = false
	) {
		if (startingNumber === false) startingNumber = fromIndex;
		let addition = 0;
		for (let index = fromIndex; index < array.length; index++) {
			array[index][property] = (startingNumber + addition) as T[P];
			addition++;
		}
	}

	/**
	 * Updates a specified numeric property (e.g., "order") fromIndex to toIndex which reflects order of elements in array.
	 *
	 * @template T - The type of elements in the array, which must include a numeric property specified by `P`.
	 * @template P - The key of the numeric property to update, defaults to "order".
	 *
	 * @param {number} fromIndex - The index of the element to move.
	 * @param {number} toIndex - The target index to move the element to.
	 * @param {T[]} array - The array containing the elements with property to reorder.
	 * @param {P} [property="order"] - The name of the numeric property to update. Defaults to "order".
	 *
	 * @returns {boolean} - Returns `true` if the operation is successful, or `false` if indices are out of bounds.
	 */
	function changeObjectsOrderRange<
		T extends Record<string, any> & { [key in P]: number },
		P extends string = "order",
	>(
		fromIndex: number,
		toIndex: number,
		array: T[],
		property: P = "order" as P
	): boolean {
		if (
			fromIndex < 0 ||
			toIndex < 0 ||
			fromIndex >= array.length ||
			toIndex >= array.length
		) {
			return false;
		}
		if (toIndex === fromIndex) return true;

		if (toIndex > fromIndex) {
			// moved to higher order (lower down if ascending ordering)
			for (let index = fromIndex; index <= toIndex; index++) {
				array[index][property] = index as T[P];
			}
		} else {
			// moved to lower order (raise up if ascending ordering)
			for (let index = toIndex; index <= fromIndex; index++) {
				array[index][property] = index as T[P];
			}
		}
		return true;
	}

	/**
	 *
	 * @param {T[]} array - The array containing the elements with property to reorder.
	 * @param {P} [property="order"] - The name of the numeric property to update with index of given array. Defaults to "order".
	 */
	function resetObjectsOrderPropertyInArray<
		T extends Record<string, any> & { [key in P]: number },
		P extends string = "order",
	>(array: T[], property: P = "order" as P): boolean {
		if (!array[0] || !array[0][property]) return false;
		array.forEach((el, i) => {
			el[property] = i as T[P];
		});
		return true;
	}
</script>
