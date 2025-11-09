
/**
 * 列元数据接口
 */
export interface ColumnMeta {
  /** 列显示名称 */
  displayName?: string;
  /** 列描述 */
  description?: string;
  /** 是否默认隐藏 */
  defaultHidden?: boolean;
  /** 列宽度 */
  width?: number | string;
}
