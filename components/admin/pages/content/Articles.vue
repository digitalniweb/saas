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
				<v-card v-show="menuTreeActivated.length > 0">
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
							style="left: 70px"
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
									:object="menudata"
									property="otherUrl"
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
							<v-card v-if="widgetsdata" class="pa-5">
								<v-alert
									icon="mdi-help-circle-outline"
									border="start"
									class="mb-3"
									density="compact"
								>
									{{ translate("Use mouse to drag") }}
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
											element: WidgetContent,
											index: number,
										}"
									>
										<v-list-item
											variant="elevated"
											class="mb-1"
										>
											<template v-slot:prepend>
												<!-- <v-icon
												icon="mdi-swap-vertical"
											></v-icon> -->
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
												<v-icon>
													{{
														getWidget(
															widgetContent.widgetId
														)?.icon || "mdi-cube"
													}}
												</v-icon>
											</template>
											<template v-slot:default>
												<!-- <v-list-item-subtitle
													class="text--primary"
													v-text="
														getWidget(
															widgetContent.widgetId
														)?.name || ''
													"
												></v-list-item-subtitle> -->
												<v-list-item-title
													v-text="
														translate(
															widgetContent.name
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
															editWidgetContent(
																widgetContent
															)
														"
													/>
													<v-btn
														size="x-small"
														color="red"
														icon="mdi-delete-outline"
														@click="deleteWidget(i)"
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
			</v-scroll-x-transition>
		</v-col>
	</v-row>
	<AdminBlocksPickWidget
		v-model="chooseWidgetDialog"
		:moduleName="moduleName"
		@widgetSelected="widgetSelected"
	/>
	<AdminBlocksEditWidgetContent
		v-model="editWidgetContentDialog"
		:widget="pickedWidget"
		:widget-content="pickedWidgetContent"
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
		"Use mouse to drag": {
			en: "To change order of widgets you can drag and drop individual widgets using mouse.",
			cs: "Ke změně pořadí widgetů můžete kliknou a přetáhnout jednotlivé widgety pomocí myši.",
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

	import { VTreeview } from "vuetify/labs/VTreeview";
	import slugify from "slugify";
	import draggable from "vuedraggable";

	import {
		WidgetContentNew,
		WidgetContentCreate,
	} from "../../../../digitalniweb-types";

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

	import { useConfirmStore } from "~/store/confirm";
	const confirmStore = useConfirmStore();

	import { useCurrentPageStore } from "../../../../store/currentPage";
	const currentPage = useCurrentPageStore();

	import { useWebsiteStore } from "~/store/website";
	const websiteStore = useWebsiteStore();

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
		let slug = "/";
		if (!string) return slug;
		slug += slugify(string, { lower: true, strict: true });
		return slug;
	};

	// for assigning menu to root
	const rootObject = {
		id: -1,
		name: translate("Main menu"),
		order: -1,
		url: "/",
	};

	const newMenuDefault = {
		name: translate("New menu"),
		id: 0,
		title: "",
		description: "",
		active: true,
		languageId: currentPage.language?.id,
		otherUrl: "",
		freeMenu: false,
		websiteId: websiteStore.$state.data?.id,
		websitesMsId: websiteStore.$state.data?.websitesMsId,
		url: createSlug(translate("New menu")),
	} as Partial<InferAttributes<Article>>;

	const chooseWidgetDialog = ref(false);
	const openChooseWidget = async () => {
		chooseWidgetDialog.value = true;
	};

	const editWidgetContentDialog = ref(false);

	const { fetchData } = useApiCall();

	const pickedWidgetContent = ref<InferAttributes<WidgetContent> | null>(
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

	const selectedOrder = ref({});

	const menuTreeActivated = ref<menuTreeNode[]>([]);

	const pickedWidget = ref<InferAttributes<Widget> | null>(null);

	const widgetSelected = (widget: InferAttributes<Widget>) => {
		pickedWidget.value = widget;
		editWidgetContentDialog.value = true;
	};

	const editWidgetContent = (
		widgetContent: InferAttributes<WidgetContent>
	) => {
		if (!pickedWidget.value)
			pickedWidget.value = getWidget(widgetContent.widgetId) ?? null;

		pickedWidgetContent.value = widgetContent;
		editWidgetContentDialog.value = true;
	};

	import { useModulesStore } from "~/store/modules";
	const modules = useModulesStore();

	const moduleName = "articles";
	const currentModule = modules.globalData.find((e) => e.name === moduleName);
	// I should do some error handling here, because "currentModule" should must exist

	const returnedWidgetContent = (
		newInfoWidgetContent:
			| WidgetContentNew
			| InferAttributes<WidgetContent>
			| null
	) => {
		if (!pickedWidget.value || !newInfoWidgetContent) {
			pickedWidgetContent.value = null;
			pickedWidget.value = null;
			return;
		}
		pickedWidget.value = getWidget(pickedWidget.value.id) ?? null;

		if (!("id" in newInfoWidgetContent)) {
			let newWidgetContent = {
				...newInfoWidgetContent,
				order: widgetsdata.value?.length || 0,
				moduleId: currentModule?.id,
				widgetId: pickedWidget.value?.id,
			} as WidgetContentCreate;
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

	const formdataOriginalWidgetContent = ref<InferAttributes<WidgetContent>[]>(
		[]
	);
	const menudata = ref<InferAttributes<Article> | null>(null);
	const widgetsdata = ref<
		(InferAttributes<WidgetContent> | WidgetContentCreate)[] | null
	>(null);

	type menuTreeNode = TreeNode<Partial<InferAttributes<Article>>>;

	const newMenuActive = ref(false);
	const createNewMenu = () => {
		newMenuActive.value = true;
		let newMenu = structuredClone(newMenuDefault);
		newMenu.order = menus.value?.length ?? 0;
		menus.value?.push(newMenu);
		menuTreeActivated.value = [newMenu];

		pickMenuTreeActivated.value = [rootObject];
		menudata.value = newMenu as InferAttributes<Article>;
		createMenuOrder();
	};

	const tab = ref(null);

	// currently picked Menu's order
	const pickMenuOrder = ref<menuTreeNode[]>([]);
	const firstOrder = { title: "1", name: translate("As first"), order: 0 };
	const createMenuOrder = (selectFirst = false) => {
		let orderOptions = [firstOrder] as menuTreeNode[];
		if (selectFirst) selectedOrder.value = firstOrder;

		let children = [] as menuTreeNode[];

		let pickedLevelMenus = [] as menuTreeNode[];
		if (pickMenuTreeActivated.value[0]?.id === -1) {
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
		// menu
		console.log(menuTreeActivated.value[0]);

		//  menu's WidgetContent - create new / edited / deleted
		let deletedWCs = [] as number[];
		let newWCs = [] as WidgetContentCreate[];
		let editedWCs = [] as Partial<InferAttributes<WidgetContent>>[];

		let newWidgetContentData = [] as (
			| InferAttributes<WidgetContent>
			| WidgetContentCreate
		)[];
		if (widgetsdata.value) newWidgetContentData = [...widgetsdata.value];

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
			] as InferAttributes<WidgetContent>;
			let diff = formDataFunctions.dataDifference(wc, editCandidateWC);
			if (Object.keys(diff).length > 0) {
				editedWCs.push({
					...diff,
					moduleId: currentModule?.id,
					id: editCandidateWC.id,
				});
			}
			newWidgetContentData.splice(indexWC, 1);
		});
		newWCs = newWidgetContentData;
		console.log(deletedWCs, newWCs, editedWCs);

		// console.log(
		// 	formDataFunctions.dataDifference(formdataOriginalWidgetContent, formdataOriginalWidgetContent)
		// );
	};

	const activatedChanged = async (e: menuTreeNode[]) => {
		// even though it returns array it can contain only 1 activated menu
		if (e.length === 0) return;

		if (newMenuActive) {
			// assure user he wants to cancel his "new menu creation"
			return;
			newMenuActive.value = false;
		}

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
			menudata.value = formDataFunctions.cloneData(data?.moduleInfo);
		}

		if (data?.widgetContents) {
			formdataOriginalWidgetContent.value = data.widgetContents;
			widgetsdata.value = formDataFunctions.cloneData(
				data?.widgetContents
			);
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
				text: "MenuLocationFail",
			});
			return;
		}

		let child = findById(menuTreeActivated.value[0], clickedPickMenuId);
		if (child) {
			snackBars.setSnackBar({
				color: "warning",
				text: "MenuLocationFail",
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
		() => !!menudata.value?.name || translate("Fill in this field"),
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
		return (
			(pickMenuTreeActivated.value[0].id !== -1
				? pickMenuTreeActivated.value[0].url
				: "") + currentNameSlug.value
		);
	});

	const changeArticleWidgetProperty = (a: any, b: any, c: any) => {};
	const changeWidgetPosition = (
		way: "up" | "down",
		index: number,
		widget: WidgetContent
	) => {
		let changed = {
			moved: {
				element: widget,
				newIndex: way == "up" ? index - 1 : index + 1,
				oldIndex: index,
			},
		};
		changeDraggablePositionProgramatically(changed.moved.newIndex, index);
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
		changed: draggablePositionChanged<WidgetContent>
	) => {
		console.log(changed);

		console.log(changed.moved.element.content);

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
		changed: draggablePositionChanged<WidgetContent>
	) => {
		changeDraggablePositionProgramatically(
			changed.moved.newIndex,
			changed.moved.oldIndex
		);
	};

	import { useWidgetsStore } from "~/store/widgets";
	import { Widget } from "../../../../digitalniweb-types/models/globalData";
	import { cs } from "vuetify/locale";

	const widgets = useWidgetsStore();
	const getWidget = (widgetId: number) => {
		return widgets.$state.globalData.find((e) => e.id === widgetId);
	};

	const changeWidgetsOrder = (
		changed: draggablePositionChanged<WidgetContent>
	) => {
		//create custom function
		if (widgetsdata.value)
			changeObjectsOrderRange(
				changed.moved.oldIndex,
				changed.moved.newIndex,
				widgetsdata.value
			);
		console.log(widgetsdata.value);

		// also add:
		// - reindex when deleted
		// - reindex after adding to whatever place

		return true;
	};

	/**
	 * Mutates array
	 * @param {number} fromIndex - The index of the element to move.
	 * @param {number} toIndex - The target index to move the element to.
	 * @param {any[]} array - The array containing the elements to move.
	 * @returns {boolean} - Returns `true` if the operation is successful, or `false` if indices are out of bounds.
	 */
	function changeArrayOrder(
		fromIndex: number,
		toIndex: number,
		array: any[]
	) {
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
		P extends string = "order"
	>(fromIndex: number, array: T[], property: P = "order" as P) {
		for (let index = fromIndex; index < array.length; index++) {
			array[index][property] = index as T[P];
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
		P extends string = "order"
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
		P extends string = "order"
	>(array: T[], property: P = "order" as P): boolean {
		if (!array[0] || !array[0][property]) return false;
		array.forEach((el, i) => {
			el[property] = i as T[P];
		});
		return true;
	}
</script>
