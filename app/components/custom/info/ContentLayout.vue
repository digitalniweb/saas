<template>
	<div class="container-content-diagram">
		<div class="page">
			<span class="description">{{ translate("page2") }}</span>
			<div class="outer">
				<span class="description">{{ translate("container") }}</span>
				<div class="inner">
					<span class="description">{{ translate("content") }}</span>
					<span class="description-text">TEXT</span>
				</div>
			</div>
		</div>
	</div>
	<div class="container-padding-diagram">
		<div class="page">
			<div class="margin">
				<span class="description">{{ translate("Margin") }}</span>
				<div class="content">
					<span class="description">
						{{ translate("content") }}
					</span>
					<div class="padding">
						<span class="description">
							{{ translate("Padding") }}</span
						>
						<div class="description-text">TEXT</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.container-content-diagram {
		.page {
			position: relative;
			padding: 0 40px;
			text-align: center;
			background-color: #aaa;
			.description {
				position: absolute;
				top: 0;
				left: 0px;
				background: rgba(0, 0, 0, 0.3);
				padding: 2px 10px;
				font-size: 14px;
				color: #fff;
				border-radius: 0 0 5px 0;
			}
			.outer {
				position: relative;
				padding: 40px;
				display: inline-block;
				background: #444;
				max-width: 100%;
				.inner {
					position: relative;
					height: 75px;
					width: 250px;
					max-width: 100%;
					background: repeating-linear-gradient(
						-45deg,
						#888,
						#888 1px,
						transparent 2px,
						transparent 6px
					);
					border: 2px solid #333;
					border-radius: 6px;
					display: flex;
					justify-content: center;
					align-items: center;
					.description-text {
						font-weight: bold;
						text-shadow: 3px 3px #000;
					}
				}
			}
		}
	}
	.container-padding-diagram {
		.page {
			margin-top: 20px;
			text-align: center;
			background-color: rgba(255, 255, 80, 0.6);
			position: relative;
			overflow: hidden;
			.description {
				position: absolute;
				top: 10px;
				right: 0;
				background: rgba(0, 0, 0, 0.3);
				padding: 2px 10px;
				font-size: 14px;
				color: #fff;
				border-radius: 5px;
				box-sizing: border-box;
			}
			.margin {
				padding: 40px;
				max-width: 100%;
				display: inline-block;
				position: relative;
				.description {
					position: absolute;
					background: #444;
					padding: 2px 10px;
					font-size: 14px;
					color: #fff;
					border-radius: 5px;
					box-sizing: border-box;
				}
				.content {
					display: flex;
					border: 2px solid #333;
					background-color: #aaa;
					border-radius: 6px;
					height: 150px;
					width: 330px;
					max-width: 100%;
					position: relative;
					& > .description {
						right: auto;
						position: absolute;
						top: 0;
						left: 0px;
						background: rgba(0, 0, 0, 0.3);
						padding: 2px 10px;
						font-size: 14px;
						color: #fff;
						border-radius: 0 0 5px 0;
						z-index: 1;
						max-width: 100%;
					}
					.padding {
						position: relative;
						width: 100%;
						border: 40px solid rgba(255, 255, 120, 0.4);
						background: repeating-linear-gradient(
							-45deg,
							#888,
							#888 1px,
							transparent 2px,
							transparent 6px
						);
						display: flex;
						justify-content: center;
						align-items: center;
						.description {
							position: absolute;
							top: -35px;
							right: -35px;
							background: #444;
							padding: 2px 10px;
							font-size: 14px;
							color: #fff;
							border-radius: 5px;
							box-sizing: border-box;
						}
						.description-text {
							font-weight: bold;
							text-shadow: 1px 1px #000;
						}
					}
				}
			}
		}
	}
</style>
<script setup lang="ts">
	const { translate } = useTranslations();
</script>
