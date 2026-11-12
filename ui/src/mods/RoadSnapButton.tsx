import { createElement, useEffect, useState } from "react";
import { bindValue, trigger, useValue } from "cs2/api";
import { tool } from "cs2/bindings";
import { useLocalization } from "cs2/l10n";
import { ModuleRegistryExtend } from "cs2/modding";
import { VanillaComponentResolver } from "mods/VanillaComponentResolver";

const MIN_ANGLE = 1;
const MAX_ANGLE = 90;

const snapEnabled$ = bindValue<boolean>("customRoadSnap", "snapEnabled", false);
const snapAngle$ = bindValue<number>("customRoadSnap", "snapAngle", 30);

export const RoadSnapSection: ModuleRegistryExtend = (Component: any) => {
    return (props: any) => {
        const snapEnabled = useValue(snapEnabled$);
        const snapAngle = useValue(snapAngle$);
        const isNetTool = useValue(tool.activeTool$)?.id === "Net Tool";
        const { translate } = useLocalization();

        // Local copy so the thumb follows the pointer without waiting for the round trip.
        const [angle, setAngle] = useState(snapAngle);
        useEffect(() => setAngle(snapAngle), [snapAngle]);

        const stepTransformer = VanillaComponentResolver.instance.useStepTransformer(1);

        const result = Component();

        if (isNetTool) {
            const { Section, ToolButton, Slider, DescriptionTooltip } = VanillaComponentResolver.instance;
            const theme = VanillaComponentResolver.instance.mouseToolOptionsTheme;

            const sectionTitle = translate("ToolOptions.SECTION[CustomRoadSnap.SnapSection]", "Custom Snap");
            const buttonTooltip = translate("ToolOptions.TOOLTIP_DESCRIPTION[CustomRoadSnap.ToggleSnap]", "Straßen-Einrasten ein-/ausschalten");
            const sliderTitle = translate("ToolOptions.TOOLTIP_TITLE[CustomRoadSnap.SnapAngle]", "Snap angle");
            const sliderDescription = translate(
                "ToolOptions.TOOLTIP_DESCRIPTION[CustomRoadSnap.SnapAngle]",
                "Angle between the snap directions used by the custom snap."
            );

            const onAngleChange = (value: number) => {
                setAngle(value);
                trigger("customRoadSnap", "setSnapAngle", value);
            };

            result?.props?.children?.push(
                createElement(Section, { title: sectionTitle },
                    createElement(ToolButton, {
                        selected: snapEnabled,
                        tooltip: buttonTooltip,
                        onSelect: () => trigger("customRoadSnap", "toggleSnap"),
                        src: "Media/Glyphs/Angle.svg",
                        focusKey: VanillaComponentResolver.instance.FOCUS_DISABLED,
                        className: VanillaComponentResolver.instance.toolButtonTheme.ToolButton,
                    }),
                    createElement("div", { className: theme.numberField }, `${Math.round(angle)}°`),
                    createElement(DescriptionTooltip, { title: sliderTitle, description: sliderDescription },
                        createElement(Slider, {
                            start: MIN_ANGLE,
                            end: MAX_ANGLE,
                            value: angle,
                            gamepadStep: 1,
                            valueTransformer: stepTransformer,
                            onChange: onAngleChange,
                            className: theme.slider,
                        })
                    )
                )
            );
        }

        return result;
    };
};
