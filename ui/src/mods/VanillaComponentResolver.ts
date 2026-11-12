import { ModuleRegistry } from "cs2/modding";

export class VanillaComponentResolver {
    static _instance: VanillaComponentResolver;

    static get instance(): VanillaComponentResolver {
        return this._instance;
    }

    static setRegistry(registry: ModuleRegistry) {
        this._instance = new VanillaComponentResolver(registry);
    }

    registryData: ModuleRegistry;
    cachedData: Record<string, any> = {};

    static registryMap: Record<string, [string, string]> = {
        Section:          ["game-ui/game/components/tool-options/mouse-tool-options/mouse-tool-options.tsx", "Section"],
        ToolButton:       ["game-ui/game/components/tool-options/tool-button/tool-button.tsx", "ToolButton"],
        toolButtonTheme:  ["game-ui/game/components/tool-options/tool-button/tool-button.module.scss", "classes"],
        FOCUS_DISABLED:   ["game-ui/common/focus/focus-key.ts", "FOCUS_DISABLED"],
        Slider:           ["game-ui/common/input/slider/slider.tsx", "Slider"],
        useStepTransformer: ["game-ui/common/input/slider/slider.tsx", "useStepTransformer"],
        DescriptionTooltip: ["game-ui/common/tooltip/description-tooltip/description-tooltip.tsx", "DescriptionTooltip"],
        mouseToolOptionsTheme: ["game-ui/game/components/tool-options/mouse-tool-options/mouse-tool-options.module.scss", "classes"],
    };

    constructor(registry: ModuleRegistry) {
        this.registryData = registry;
    }

    updateCache(key: string): any {
        const [module, exportName] = VanillaComponentResolver.registryMap[key];
        return (this.cachedData[key] = (this.registryData.registry.get(module) as any)[exportName]);
    }

    get Section(): any    { return this.cachedData["Section"]         ?? this.updateCache("Section"); }
    get ToolButton(): any { return this.cachedData["ToolButton"]      ?? this.updateCache("ToolButton"); }
    get toolButtonTheme(): any { return this.cachedData["toolButtonTheme"] ?? this.updateCache("toolButtonTheme"); }
    get FOCUS_DISABLED(): any  { return this.cachedData["FOCUS_DISABLED"]  ?? this.updateCache("FOCUS_DISABLED"); }
    get Slider(): any     { return this.cachedData["Slider"]          ?? this.updateCache("Slider"); }
    get useStepTransformer(): any { return this.cachedData["useStepTransformer"] ?? this.updateCache("useStepTransformer"); }
    get DescriptionTooltip(): any { return this.cachedData["DescriptionTooltip"] ?? this.updateCache("DescriptionTooltip"); }
    get mouseToolOptionsTheme(): any { return this.cachedData["mouseToolOptionsTheme"] ?? this.updateCache("mouseToolOptionsTheme"); }
}
