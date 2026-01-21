"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ja' | 'zh' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  ja: {
    'garage.title': '私のガレージ',
    'garage.add_vehicle': '+ 車両を追加',
    'garage.no_vehicles': '車両が見つかりません。',
    'garage.add_first': '最初の車両を追加して追跡を開始しましょう。',
    'garage.view': '詳細 >',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.loading': '読み込み中...',
    'common.close': '閉じる',
    'common.delete': '削除',
    'common.confirm_delete': '本当に削除しますか？',
    'vehicle.name': '車両名',
    'vehicle.type': 'タイプ',
    'vehicle.subtype': 'サブタイプ',
    'vehicle.odometer': '現在の走行距離 (km)',
    'vehicle.add_title': '車両を追加',
    'vehicle.type.car': '自動車',
    'vehicle.type.motorcycle': 'バイク',
    'fuel.add_title': '給油を記録',
    'fuel.date': '日付',
    'fuel.liters': '給油量 (L)',
    'fuel.price': '合計金額',
    'fuel.full_tank': '満タン給油？',
    'fuel.save_record': '記録を保存',
    'fuel.history': '給油履歴',
    'fuel.stats.avg': '平均燃費',
    'fuel.stats.last': '前回の燃費',
    'fuel.stats.total_dist': '総走行距離',
    'fuel.stats.cost_km': 'km単価',
    'fuel.no_records': '給油記録はまだありません。',
    'fuel.station': '給油所',
    'placeholder.station': '例: シェル石油',
    'maintenance.status': 'メンテナンス状況',
    'maintenance.settings': '設定',
    'maintenance.next_service': '次回サービス',
    'maintenance.estimated_date': '予測日',
    'maintenance.days_remaining': '約 {days} 日後',
    'maintenance.settings.interval': 'サービス間隔 (km)',
    'maintenance.settings.last_km': '前回サービス走行距離',
    'maintenance.settings.last_date': '前回サービス日',
    'map.find_gas': '給油所を探す',
    'map.nearby': '近くの給油所',
    'map.locating': '現在地を取得中...',
    'map.permission_error': '給油所を探すには位置情報を許可してください。',
    'header.title': '燃費・メンテナンス管理',
    'header.subtitle': 'ガレージを管理し、燃費を追跡します。',
    'back.garage': '← ガレージへ戻る',
    'close.engine': 'エンジンを閉じる',
    'add.fuel': '+ 給油',
    'placeholder.vehicle_name': '例: 私のシビック',
    'placeholder.odometer': '例: 50000',
    'placeholder.liters': 'リットル',
    'placeholder.cost': '金額',
  },
  zh: {
    'garage.title': '我的车库',
    'garage.add_vehicle': '+ 添加车辆',
    'garage.no_vehicles': '未找到车辆。',
    'garage.add_first': '添加您的第一辆车开始追踪。',
    'garage.view': '查看详情 >',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.loading': '加载中...',
    'common.close': '关闭',
    'common.delete': '删除',
    'common.confirm_delete': '确定要删除吗？',
    'vehicle.name': '车辆名称',
    'vehicle.type': '类型',
    'vehicle.subtype': '子类型',
    'vehicle.odometer': '当前里程 (km)',
    'vehicle.add_title': '添加车辆',
    'vehicle.type.car': '汽车',
    'vehicle.type.motorcycle': '摩托车',
    'fuel.add_title': '记录加油',
    'fuel.date': '日期',
    'fuel.liters': '加油量 (L)',
    'fuel.price': '总金额',
    'fuel.full_tank': '是否加满？',
    'fuel.save_record': '保存记录',
    'fuel.history': '加油历史',
    'fuel.stats.avg': '平均油耗',
    'fuel.stats.last': '上次油耗',
    'fuel.stats.total_dist': '总里程',
    'fuel.stats.cost_km': '每公里成本',
    'fuel.no_records': '暂无加油记录。',
    'fuel.station': '加油站',
    'placeholder.station': '例如：壳牌加油站',
    'maintenance.status': '保养状态',
    'maintenance.settings': '设置',
    'maintenance.next_service': '下次保养',
    'maintenance.estimated_date': '预计日期',
    'maintenance.days_remaining': '约 {days} 天后',
    'maintenance.settings.interval': '保养间隔 (km)',
    'maintenance.settings.last_km': '上次保养里程',
    'maintenance.settings.last_date': '上次保养日期',
    'map.find_gas': '查找加油站',
    'map.nearby': '附近加油站',
    'map.locating': '定位中...',
    'map.permission_error': '请允许位置权限以查找加油站。',
    'header.title': '油耗与保养追踪',
    'header.subtitle': '管理您的车库并追踪油耗。',
    'back.garage': '← 返回车库',
    'close.engine': '关闭引擎',
    'add.fuel': '+ 加油',
    'placeholder.vehicle_name': '例如：我的思域',
    'placeholder.odometer': '例如：50000',
    'placeholder.liters': '升',
    'placeholder.cost': '金额',
  },
  en: {
    'garage.title': 'My Garage',
    'garage.add_vehicle': '+ Add Vehicle',
    'garage.no_vehicles': 'No vehicles found.',
    'garage.add_first': 'Add your first vehicle to start tracking.',
    'garage.view': 'View >',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.delete': 'Delete',
    'common.confirm_delete': 'Are you sure you want to delete?',
    'vehicle.name': 'Vehicle Name',
    'vehicle.type': 'Type',
    'vehicle.subtype': 'Subtype',
    'vehicle.odometer': 'Current Odometer (km)',
    'vehicle.add_title': 'Add Vehicle',
    'vehicle.type.car': 'Car',
    'vehicle.type.motorcycle': 'Motorcycle',
    'fuel.add_title': 'Log Refuel',
    'fuel.date': 'Date',
    'fuel.liters': 'Liters',
    'fuel.price': 'Total Price',
    'fuel.full_tank': 'Full Tank?',
    'fuel.save_record': 'Save Record',
    'fuel.history': 'Fuel History',
    'fuel.stats.avg': 'Avg Consumption',
    'fuel.stats.last': 'Last Consumption',
    'fuel.stats.total_dist': 'Total Distance',
    'fuel.stats.cost_km': 'Cost/km',
    'fuel.no_records': 'No fuel records yet.',
    'fuel.station': 'Gas Station',
    'placeholder.station': 'e.g. Shell Station',
    'maintenance.status': 'Maintenance Status',
    'maintenance.settings': 'Settings',
    'maintenance.next_service': 'Next Service',
    'maintenance.estimated_date': 'Estimated Date',
    'maintenance.days_remaining': 'In approx {days} days',
    'maintenance.settings.interval': 'Service Interval (km)',
    'maintenance.settings.last_km': 'Last Service Odometer',
    'maintenance.settings.last_date': 'Last Service Date',
    'map.find_gas': 'Find Gas',
    'map.nearby': 'Nearby Stations',
    'map.locating': 'Locating you...',
    'map.permission_error': 'Please enable location access to find gas stations.',
    'header.title': 'Fuel & Maintenance Tracker',
    'header.subtitle': 'Manage your garage and track consumption.',
    'back.garage': '← Back to Garage',
    'close.engine': 'Close Engine',
    'add.fuel': '+ Add Fuel',
    'placeholder.vehicle_name': 'e.g. My Civic',
    'placeholder.odometer': 'e.g. 50000',
    'placeholder.liters': 'Liters',
    'placeholder.cost': 'Cost',
  }
};

const I18nContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, params?: any) => string;
}>({
  lang: 'ja',
  setLang: () => { },
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('ja');

  // 从本地存储加载
  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Language;
    if (saved && ['ja', 'zh', 'en'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('app-lang', l);
  };

  const t = (key: string, params: any = {}) => {
    let text = translations[lang][key] || translations['en'][key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(`{${p}}`, params[p]);
    });
    return text;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
