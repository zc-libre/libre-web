import Background0 from '@/assets/images/background.jpg'
import Background1 from '@/assets/images/background1.jpg'
import Background2 from '@/assets/images/background2.jpg'
import Background3 from '@/assets/images/background3.jpg'
import Background4 from '@/assets/images/background4.jpg'

const bgs = [Background0, Background1, Background2, Background3, Background4]

/**
 * 获取背景
 */
export function getBackGround() {
  // 按季度切换背景
  return bgs[Math.ceil((new Date().getMonth() + 1) / 4)]
}
