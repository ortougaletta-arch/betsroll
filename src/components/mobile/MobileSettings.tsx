import { useNavigate } from 'react-router-dom';
import { ME } from '../../data/user';
import { actions, useStore } from '../../state/useStore';
import { Avatar } from '../primitives/Avatar';
import { Icon } from '../primitives/icons';
import { TierBadge } from '../primitives/TierBadge';
import { SettingsRow, SettingsSection, TopBar } from '../primitives/system';

export function MobileSettings() {
  const nav = useNavigate();
  const settings = useStore((s) => s.settings);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', overflow: 'auto', paddingBottom: 100 }}>
      <TopBar title="Settings" onBack={() => nav(-1)} />
      <div style={{ padding: 14 }}>
        <button onClick={() => nav('/profile')} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
          <Avatar name="MV" size={50} ring="var(--gold)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}><span style={{ fontWeight: 800, fontSize: 16 }}>{ME.handle}</span><TierBadge tier="Gold" size="sm" /></div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ME.bio}</div>
            <div style={{ fontSize: 11, color: '#a794ff', fontWeight: 600, marginTop: 4 }}>Edit profile</div>
          </div>
        </button>
      </div>
      <SettingsSection title="Account">
        <SettingsRow icon={Icon.wallet(15)} label="Wallet & balances" sub="Deposit, withdraw, security" onClick={() => nav('/wallet')} />
        <SettingsRow icon={Icon.crown(15)} label="VIP & rewards" sub="Gold tier - $5.00 freebets active" onClick={() => nav('/profile')} />
        <SettingsRow icon={Icon.trend(15)} label="Trading history" sub="All your rolls" onClick={() => nav('/profile')} last />
      </SettingsSection>
      <SettingsSection title="Notifications">
        {Object.entries(settings.notifs).map(([key, value], index, arr) => (
          <SettingsRow key={key} label={key} toggle={{ value, onChange: (v) => actions.setSetting('notifs', key, v) }} last={index === arr.length - 1} />
        ))}
      </SettingsSection>
      <SettingsSection title="Security">
        <SettingsRow icon={Icon.check(15)} label="Two-factor authentication" sub={settings.twoFA ? 'On - Authenticator app' : 'Off - recommended for accounts >$500'} toggle={{ value: settings.twoFA, onChange: (v) => actions.setSetting(null, 'twoFA', v) }} />
        <SettingsRow icon={Icon.bookmark(15)} label="Recovery passphrase" sub="Backup codes" />
        <SettingsRow icon={Icon.die(15)} label="Trading limits" sub="Daily max $5,000 - per-trade $2,000" last />
      </SettingsSection>
      <SettingsSection title="Display & language">
        <SettingsRow icon={Icon.search(15)} label="Language" value={settings.language} />
        <SettingsRow icon={Icon.spark(15)} label="Theme" value={settings.theme} sub="Light mode coming soon" />
        <SettingsRow icon={Icon.check(15)} label="Hide balance" toggle={{ value: settings.hideBalance, onChange: (v) => actions.setSetting(null, 'hideBalance', v) }} last />
      </SettingsSection>
      <SettingsSection title="Help & legal">
        <SettingsRow icon={Icon.chat(15)} label="Help center" />
        <SettingsRow icon={Icon.bookmark(15)} label="Terms of service" />
        <SettingsRow icon={Icon.close(15)} label="Sign out" danger last />
      </SettingsSection>
      <div style={{ textAlign: 'center', padding: '20px 24px 30px', fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>
        Trading involves risk. Markets resolve via Chainlink oracles.
      </div>
    </div>
  );
}
