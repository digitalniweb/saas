<template>
	<div v-if="widgetContent">
		<v-row>
			<v-col>
				<v-row>
					<v-col cols="12">
						<v-card elevation="10" class="mt-7" color="border-md">
							<v-card-title class="text-overline">
								{{ translate("Name2") }}
							</v-card-title>
							<v-card-text>
								<v-row>
									<v-col cols="12">
										<v-text-field
											variant="underlined"
											counter="64"
											prepend-inner-icon="mdi-alpha-n"
											v-model="widgetContent.name"
											validate-on="blur"
											:rules="[
												() =>
													!!widgetContent?.name ||
													translate(
														'Fill in this field'
													),
											]"
										>
											<template #append>
												<v-tooltip
													:text="translate('show')"
													location="bottom"
													v-if="
														widgetContent.options
															?.heading?.show !==
														undefined
													"
												>
													<template
														v-slot:activator="{
															props,
														}"
													>
														<v-switch
															v-bind="props"
															density="compact"
															hide-details
															v-model="
																widgetContent
																	.options
																	.heading
																	.show
															"
															width="50px"
															color="success"
														/>
													</template>
												</v-tooltip>
											</template>
										</v-text-field>
									</v-col>
								</v-row>
								<v-expand-transition>
									<v-row
										v-show="
											widgetContent.options?.heading?.show
										"
									>
										<v-col sm="auto" cols="12">
											<v-select
												:items="headingTypes"
												v-if="
													widgetContent.options
														?.heading?.type
												"
												v-model="
													widgetContent.options
														.heading.type
												"
												:label="translate('Show as')"
												min-width="150px"
												density="compact"
												hide-details
												variant="solo"
												class="elevation-0 ml-5 align-center"
											></v-select>
										</v-col>
										<v-col sm="auto" cols="12">
											<v-select
												:items="textClasses"
												v-if="
													widgetContent.options
														?.heading?.class !==
													undefined
												"
												v-model="
													widgetContent.options
														.heading.class
												"
												:label="
													translate(
														'Custom CSS class'
													)
												"
												min-width="180px"
												density="compact"
												hide-details
												variant="solo"
												class="elevation-0 ml-5 align-center"
											></v-select>
										</v-col>
										<v-col sm="auto" cols="12">
											<v-select
												:items="textWeight"
												v-if="
													widgetContent.options
														?.heading?.weight !==
													undefined
												"
												v-model="
													widgetContent.options
														.heading.weight
												"
												:label="translate('Weight')"
												min-width="150px"
												density="compact"
												hide-details
												variant="solo"
												class="elevation-0 ml-5 align-center"
											></v-select>
										</v-col>
										<v-col sm="auto" cols="12">
											<v-switch
												v-bind="props"
												density="compact"
												hide-details
												v-if="
													widgetContent?.options
														?.heading?.italic !==
													undefined
												"
												v-model="
													widgetContent.options
														.heading.italic
												"
												color="success"
											>
												<template #label>
													<span class="font-italic">
														{{
															translate("italic")
														}}
													</span>
												</template>
											</v-switch>
										</v-col>
									</v-row>
								</v-expand-transition>
							</v-card-text>
						</v-card>
					</v-col>

					<v-col cols="12">
						<v-card elevation="10" class="mt-4" color="border-md">
							<v-card-title class="text-overline">
								{{ translate("Text editor") }}
							</v-card-title>
							<v-card-text class="mt-4">
								<CustomTextEditor
									v-model="widgetContent.content"
								/>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
			<v-col class="d-none d-sm-flex" style="flex: 0 0 10px">
				<v-divider vertical thickness="3"></v-divider>
			</v-col>
			<v-col>
				<v-card>
					<v-card-text>
						<v-tabs
							v-model="tab"
							:direction="smAndDown ? 'vertical' : 'horizontal'"
						>
							<v-tab
								prepend-icon="mdi-information-slab-circle-outline"
								text="info"
								value="options-info"
							></v-tab>
							<v-tab
								prepend-icon="mdi-rectangle-outline"
								:text="translate('container')"
								value="options-container"
							></v-tab>
							<v-tab
								prepend-icon="mdi-text-box"
								:text="translate('content')"
								value="options-content"
							></v-tab>
						</v-tabs>

						<v-tabs-window v-model="tab" class="w-100">
							<v-tabs-window-item value="options-info">
								<v-card flat>
									<v-card-text>
										<CustomInfoContentLayout />
									</v-card-text>
								</v-card>
							</v-tabs-window-item>

							<v-tabs-window-item value="options-container">
								<v-card flat>
									<v-card-text>
										<CustomPickersCustomClass
											v-if="
												widgetContent.options?.container
													?.class !== undefined
											"
											v-model="
												widgetContent.options.container
													.class
											"
										/>
										<CustomPickersContainerSize
											v-if="
												widgetContent.options?.container
													?.width &&
												widgetContent.options?.container
													.height100 !== undefined
											"
											v-model:width="
												widgetContent.options.container
													.width
											"
											v-model:height100="
												widgetContent.options.container
													.height100
											"
										/>
										<CustomPickersSpacing
											v-if="
												widgetContent.options?.container
													?.margin &&
												widgetContent.options?.container
													.padding
											"
											v-model:margin="
												widgetContent.options.container
													.margin
											"
											v-model:padding="
												widgetContent.options.container
													.padding
											"
										/>
										<CustomPickersBorders
											v-if="
												widgetContent.options?.container
													?.border &&
												widgetContent.options?.container
													?.borderRadius &&
												widgetContent.options?.container
													?.elevation
											"
											v-model:border="
												widgetContent.options.container
													.border
											"
											v-model:borderRadius="
												widgetContent.options.container
													.borderRadius
											"
											v-model:shadow="
												widgetContent.options.container
													.elevation
											"
											:closable="true"
										/>
										<CustomPickersBackground
											:values="[
												'color',
												'image',
												'overlay',
											]"
											v-if="
												widgetContent?.options
													?.container?.background !==
												undefined
											"
											v-model="
												widgetContent.options.container
													.background
											"
										></CustomPickersBackground>
									</v-card-text>
								</v-card>
							</v-tabs-window-item>

							<v-tabs-window-item value="options-content">
								<v-card flat>
									<v-card-text>
										<p>
											Fusce a quam. Phasellus nec sem in
											justo pellentesque facilisis. Nam
											eget dui. Proin viverra, ligula sit
											amet ultrices semper, ligula arcu
											tristique sapien, a accumsan nisi
											mauris ac eros. In dui magna,
											posuere eget, vestibulum et, tempor
											auctor, justo.
										</p>

										<p class="mb-0">
											Cras sagittis. Phasellus nec sem in
											justo pellentesque facilisis. Proin
											sapien ipsum, porta a, auctor quis,
											euismod ut, mi. Donec quam felis,
											ultricies nec, pellentesque eu,
											pretium quis, sem. Nam at tortor in
											tellus interdum sagittis.
										</p>
									</v-card-text>
								</v-card>
							</v-tabs-window-item>
						</v-tabs-window>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-card class="w-100 mt-5">
				<v-toolbar density="compact" flat>
					<v-toolbar-title class="white--text">
						{{ translate("Preview") }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text class="pa-0 border-md">
					<WebWidgetsText :widget="widgetContent" />
				</v-card-text>
			</v-card>
		</v-row>
	</div>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();
	import type { InferAttributes } from "sequelize";
	import { useDisplay } from "vuetify";
	import deepMergeObjects from "~~/digitalniweb-custom/helpers/deepMergeObjects";
	import { widgetTextOptionsDefault } from "~~/digitalniweb-custom/variables/widgets";
	import type { WidgetText } from "~~/digitalniweb-types/models/content";
	import {
		headingTypes,
		textClasses,
		textWeight,
	} from "../../../../digitalniweb-custom/variables/css";

	const { smAndDown } = useDisplay();

	const tab = ref("option-1");

	const props = defineProps<{
		moduleId: number;
	}>();
	const widgetContent = defineModel<InferAttributes<WidgetText>>();
	if (widgetContent?.value) {
		if (props.moduleId) widgetContent.value.moduleId = props.moduleId;

		// nested objects must be filled in as default like so
		if (!widgetContent?.value.options)
			widgetContent.value.options = structuredClone(
				widgetTextOptionsDefault
			);
		else {
			widgetContent.value.options = deepMergeObjects(
				structuredClone(widgetTextOptionsDefault),
				widgetContent.value.options
			);
		}
	}
</script>
