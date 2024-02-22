import { Lang } from '@antv/x6';
import { CustomEventTypeEnum } from './enums';
import ErrorClass from './errorClass';
import { Channel } from './transmit';

/**json格式化 */
export function fmtJSON(target) {
  try {
    if (Lang.isString(target)) return JSON.parse(target);
    if (Lang.isArray(target))
      return target.map((item) => {
        if (Lang.isObject(item)) return item;
        return JSON.parse(item);
      });
    else if (Lang.isObject(target)) return target;
    else {
      Channel.dispatchEvent(
        CustomEventTypeEnum.RUNTIME_ERR,
        ErrorClass.InvalidFormatData('nodes or edges error'),
      );
      throw ErrorClass.InvalidFormatData('nodes or edges error');
    }
  } catch (error) {
    return {};
  }
}

/**文字溢出格式化 */
export function fmtLabelOverflow(label) {
  if (!Lang.isString(label)) return label;
  if (label.length <= 9) return label;
  const cutLabel = label.slice(0, 6) + '...';
  return cutLabel;
}
