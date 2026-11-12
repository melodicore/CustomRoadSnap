using Colossal.Serialization.Entities;
using Colossal.UI;
using Colossal.UI.Binding;
using Game;
using Game.SceneFlow;
using Game.UI;
using UnityEngine;

namespace CustomRoadSnapFork
{
    /// <summary>
    /// Stellt der UI einen ValueBinding für den Snap-Zustand und einen TriggerBinding
    /// für den Toggle-Button zur Verfügung.
    /// </summary>
    public partial class CustomRoadSnapUISystem : UISystemBase
    {
        // Settings are written to disk this long after the last slider change,
        // so dragging does not save on every tick (and gamepad input, which has no drag end, is saved too).
        private const float kSaveDelaySeconds = 0.75f;

        private ValueBinding<bool>  m_SnapEnabledBinding;
        private ValueBinding<float> m_SnapAngleBinding;
        private bool  m_AngleDirty;
        private float m_AngleChangedAt;

        protected override void OnCreate()
        {
            base.OnCreate();

            // Assembly.Location ist unter Mono leer – Pfad über ModManager ermitteln
            if (GameManager.instance.modManager.TryGetExecutableAsset(Mod.instance, out var asset))
            {
                string modDir = System.IO.Path.GetDirectoryName(asset.path);
                UIManager.defaultUISystem.AddHostLocation("ui-mods", modDir, false);
            }

            AddBinding(m_SnapEnabledBinding = new ValueBinding<bool>(
                "customRoadSnapFork", "snapEnabled",
                Mod.m_Setting?.SnapEnabled ?? false));

            AddBinding(m_SnapAngleBinding = new ValueBinding<float>(
                "customRoadSnapFork", "snapAngle",
                Mod.m_Setting?.SnapAngle ?? 30f));

            AddBinding(new TriggerBinding<float>(
                "customRoadSnapFork", "setSnapAngle",
                angle =>
                {
                    if (Mod.m_Setting == null) return;
                    Mod.m_Setting.SnapAngle = Mathf.Clamp(Mathf.Round(angle), 1f, 90f);
                    m_AngleDirty     = true;
                    m_AngleChangedAt = UnityEngine.Time.realtimeSinceStartup;
                }));

            AddBinding(new TriggerBinding(
                "customRoadSnapFork", "toggleSnap",
                () =>
                {
                    if (Mod.m_Setting == null) return;
                    Mod.m_Setting.SnapEnabled = !Mod.m_Setting.SnapEnabled;
                    Mod.m_Setting.ApplyAndSave();
                    Mod.ApplySnapEnabled(Mod.m_Setting.SnapEnabled);
                    Mod.log.Info($"Custom Snap (UI) {(Mod.m_Setting.SnapEnabled ? "enabled" : "disabled")}");
                }));
        }

        protected override void OnGamePreload(Purpose purpose, GameMode mode)
        {
            // Intentionally do NOT call base — UISystemBase.OnGamePreload calls set_Enabled
            // before the ECS state is ready, which causes an InvalidOperationException crash.
        }

        protected override void OnUpdate()
        {
            m_SnapEnabledBinding.Update(Mod.m_Setting?.SnapEnabled ?? false);
            m_SnapAngleBinding.Update(Mod.m_Setting?.SnapAngle ?? 30f);

            if (m_AngleDirty && UnityEngine.Time.realtimeSinceStartup - m_AngleChangedAt >= kSaveDelaySeconds)
            {
                m_AngleDirty = false;
                Mod.m_Setting?.ApplyAndSave();
            }
        }
    }
}
