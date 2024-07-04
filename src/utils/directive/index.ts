import {ElMessage} from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import useClipboard from 'vue-clipboard3'

const {toClipboard} = useClipboard()

export const clickDown = (el: HTMLElement, binding: any) => {
    let clickTimer: number | NodeJS.Timeout | null | undefined = null

    const element = el.parentNode?.parentElement ? el.parentNode?.parentElement : el
    // 单击
    element.addEventListener('click', () => {
        if (clickTimer) {
            window.clearTimeout(clickTimer);
            clickTimer = null;
        }
        clickTimer = setTimeout(() => {
            binding.value.clickFun(binding.value.clickFunType);
        }, 300);
    })

    // 双击
    element.addEventListener('dblclick', () => {
        if (clickTimer) {
            window.clearTimeout(clickTimer);
            clickTimer = null;
        }

        binding.value.dblclickFu(binding.value.dblclickFuType);
    })
}
export const copyText = (el: HTMLElement, binding: any) => {
    el.onmouseenter = () => {
        el.style.cursor = "pointer"
        el.style.textDecoration = "underline dashed"
    }
    el.onmouseleave = () => {
        el.style.textDecoration = "none"
    }
    el.onclick = () => {
        toClipboard(binding.value).then(() => {
            ElMessage({
                message: "复制成功",
                type: "success",
                duration: 800
            });
        })
    }
}
