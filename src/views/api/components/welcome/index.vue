<template>
    <div class="welcome">
      <Statistics></Statistics>
<!--        <div class="shortcut-key">-->
<!--            <div class="shortcut-key-item">-->
<!--                <span class="key-name">格式化代码</span>-->
<!--                <span class="key-value">-->
<!--                    <span class="key-btn">Ctrl</span>+<span class="key-btn"-->
<!--                        >Alt</span-->
<!--                    >+<span class="key-btn">L</span>-->
<!--                </span>-->
<!--            </div>-->
<!--            <div class="shortcut-key-item">-->
<!--                <span class="key-name">保存更改</span-->
<!--                ><span class="key-value">-->
<!--                    <span class="key-btn">Ctrl</span>+<span class="key-btn"-->
<!--                        >S</span-->
<!--                    ></span-->
<!--                >-->
<!--            </div>-->
<!--            <div class="shortcut-key-item">-->
<!--                <span class="key-name">打开设置</span-->
<!--                ><span class="key-value">-->
<!--                    <span class="key-btn">Alt</span>+<span class="key-btn"-->
<!--                        >T</span-->
<!--                    ></span-->
<!--                >-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script setup lang='ts'>
import Statistics from '@/views/api/components/statistics/index.vue';
</script>

<style lang="scss" scoped>
.welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    height: 100%;
    .shortcut-key {
        user-select: none;
        .shortcut-key-item {
            display: flex;
            height: 50px;
            align-items: center;
            span {
                display: flex;
                align-items: center;
                height: 30px;
            }
            .key-name {
                width: 120px;
                justify-content: right;
                margin-right: 20px;
            }
            .key-value {
                min-width: 100px;
                .key-btn {
                    display: block;
                    height: 24px;
                    line-height: 28px;
                    font-size: 14px;
                    background-color: rgba($color: #000000, $alpha: 0.3);
                    border-radius: 4px;
                    padding: 0 8px;
                    margin: 0 4px;
                }
            }
        }
    }
}
</style>
