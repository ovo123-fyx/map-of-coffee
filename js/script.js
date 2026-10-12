/* ============================================================
   Map of Coffee - script.js （教学重构版）

   课程：网页设计基础
   说明：本文件是整站的脚本，三个核心知识点：
        ① 防抖优化（setTimeout / clearTimeout）—— 用在搜索功能
        ② 事件委托（父容器监听 + event.target.closest()）—— 用在手风琴 / 菜单过滤
        ③ 无障碍访问（aria-expanded 状态切换）—— 用在汉堡菜单 / 手风琴

   功能列表：
   1. 深色模式切换
   2. 返回顶部按钮
   3. 搜索 / 筛选（含防抖）
   4. FAQ 手风琴（事件委托 + aria-expanded）
   5. 菜单分类筛选（事件委托）
   6. 移动端导航（汉堡菜单 + aria-expanded）
   ============================================================ */

document.addEventListener("DOMContentLoaded", function() {

    /* 进入页面时，给 body 加一个 "js" 类，
       表示 JS 已成功加载（渐进增强思想） */
    document.body.classList.add("js");


    /* ============================================================
       ── 1. 深色模式切换 ──
       知识点：localStorage 持久化用户偏好
       ============================================================ */
    let darkModeBtn = document.getElementById("darkModeBtn");

    if(darkModeBtn) {

        /* 页面加载时，先从 localStorage 读取上次保存的设置 */
        let saved = localStorage.getItem("darkMode");

        if(saved == "true") {
            document.body.classList.add("dark-mode");
            darkModeBtn.textContent = "☀️";
        }

        /* 点击按钮切换深浅色 */
        darkModeBtn.addEventListener("click", function(event) {

            document.body.classList.toggle("dark-mode");

            /* 判断切换之后到底是不是深色 */
            if(document.body.classList.contains("dark-mode")) {
                /* 现在是深色 → 按钮显示太阳，意思是"点我可以回到白天" */
                darkModeBtn.textContent = "☀️";
                localStorage.setItem("darkMode", "true");
            } else {
                /* 现在是浅色 → 按钮显示月亮 */
                darkModeBtn.textContent = "🌙";
                localStorage.setItem("darkMode", "false");
            }
        });
    }


    /* ============================================================
       ── 2. 返回顶部按钮 ──
       知识点：监听 scroll 事件 + 平滑滚动
       ============================================================ */
    let backToTopBtn = document.getElementById("backToTop");

    if(backToTopBtn) {

        /* 监听页面滚动，超过 300px 就显示按钮 */
        window.addEventListener("scroll", function(event) {
            if(window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        /* 点击按钮平滑滚回顶部 */
        backToTopBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* ============================================================
       ── 3. 搜索 / 筛选（含防抖优化）──
       知识点 ①：防抖（Debounce）

       老师说：
       如果不做防抖，用户每按一个字符都会触发一次搜索，
       100 个咖啡店还好，10000 个就会卡。
       防抖的做法是：
         每次按键时，先把上一次的"定时炸弹"拆掉，
         再装一个新的 300ms 后才会爆炸的定时炸弹。
         只要用户一直在打字，就一直拆—装—拆—装，
         真正的搜索代码只会在用户停下来 300ms 之后才执行。
       ============================================================ */
    let searchInput = document.getElementById("cafeSearch");

    if(searchInput) {

        let allCards = document.querySelectorAll(".cafe-card");
        let allRows = document.querySelectorAll(".card-row");
        let noResults = document.getElementById("noResults");

        /* 用一个变量保存定时器的编号，
           必须放在事件监听器外面，
           这样每次按键时才能拿到上一次的定时器 */
        let myTimer = null;

        searchInput.addEventListener("input", function(event) {

            /* 【防抖第一步】先把上一次的定时器干掉 */
            clearTimeout(myTimer);

            /* 【防抖第二步】重新设置一个 300ms 之后才执行的定时器
               如果用户在这 300ms 内又按键，上面的 clearTimeout 又会把它清掉 */
            myTimer = setTimeout(function() {

                /* 下面这段才是真正的搜索逻辑 */
                let query = searchInput.value.toLowerCase();
                let visibleCount = 0;

                /* 用最基础的 for 循环遍历每张卡片 */
                for(let i = 0; i < allCards.length; i++) {

                    let card = allCards[i];

                    /* 取出卡片的 data-name 和 data-location */
                    let name = "";
                    let location = "";

                    if(card.dataset.name) {
                        name = card.dataset.name.toLowerCase();
                    }
                    if(card.dataset.location) {
                        location = card.dataset.location.toLowerCase();
                    }

                    /* 判断是否匹配用户输入 */
                    if(name.includes(query) || location.includes(query)) {
                        card.classList.remove("hidden");
                        visibleCount = visibleCount + 1;
                    } else {
                        card.classList.add("hidden");
                    }
                }

                /* 再遍历每一行：如果整行的卡片都被隐藏，那么这一行也整行隐藏 */
                for(let i = 0; i < allRows.length; i++) {

                    let row = allRows[i];
                    let cardsInRow = row.querySelectorAll(".cafe-card");
                    let rowHasVisible = false;

                    /* 内层循环：检查这一行里是否还有可见的卡片 */
                    for(let j = 0; j < cardsInRow.length; j++) {
                        if(!cardsInRow[j].classList.contains("hidden")) {
                            rowHasVisible = true;
                        }
                    }

                    if(rowHasVisible) {
                        row.classList.remove("hidden");
                    } else {
                        row.classList.add("hidden");
                    }
                }

                /* 一张都没匹配上，显示 "没有结果" 提示 */
                if(noResults) {
                    if(visibleCount == 0) {
                        noResults.classList.add("visible");
                    } else {
                        noResults.classList.remove("visible");
                    }
                }

            }, 300); /* 防抖延迟 300 毫秒 */
        });
    }


    /* ============================================================
       ── 4. FAQ 手风琴 ──
       知识点 ②：事件委托（Event Delegation）

       老师说：
       一般我们会想 "每个问题按钮上都绑一个 click 监听器"。
       这样写没错，但如果以后用 JS 动态新增问题，
       新加的按钮就没有监听器了。
       事件委托的做法是：
         把监听器绑在它们共同的"父容器"上，
         点击发生时，用 event.target.closest(".faq-question")
         去找到真正被点击的那个问题按钮。

       知识点 ③：aria-expanded
       每次展开 / 收起，都要同步更新 aria-expanded 属性，
       这样屏幕阅读器才能知道当前状态。
       ============================================================ */
    let faqContainer = document.querySelector(".faq-list");

    if(faqContainer) {

        /* 注意：监听器是绑在 faqContainer 父容器上，不是每个按钮 */
        faqContainer.addEventListener("click", function(event) {

            /* 【事件委托核心】
               event.target 是真正被点击的元素，可能是按钮文字、+ 图标等
               用 closest() 向上查找最近的 .faq-question 父节点 */
            let currentBtn = event.target.closest(".faq-question");

            /* 如果点击发生在 .faq-question 之外（例如点击了容器空白处），
               closest 会返回 null，这时啥也别做 */
            if(currentBtn == null) {
                return;
            }

            event.preventDefault();

            /* 判断当前问题原本是不是展开的 */
            let isOpen = currentBtn.classList.contains("open");

            /* 先把容器里所有问题都关闭（实现"手风琴：同时只展开一个"） */
            let allQuestions = faqContainer.querySelectorAll(".faq-question");

            for(let i = 0; i < allQuestions.length; i++) {

                let q = allQuestions[i];
                q.classList.remove("open");
                q.nextElementSibling.classList.remove("open");

                /* 【无障碍核心】同步把 aria-expanded 改成 "false"
                   告诉屏幕阅读器：这一项已经收起 */
                q.setAttribute("aria-expanded", "false");
            }

            /* 如果它原本是关闭的，那现在就把它打开 */
            if(isOpen == false) {
                currentBtn.classList.add("open");
                currentBtn.nextElementSibling.classList.add("open");

                /* 同步把 aria-expanded 改成 "true" */
                currentBtn.setAttribute("aria-expanded", "true");
            }
            /* 如果它原本就是打开的，上面循环已经把它一起关掉了，
               所以这里不需要 else 分支 */
        });
    }


    /* ============================================================
       ── 5. 菜单分类筛选 ──
       知识点 ②：再次演示事件委托
       ============================================================ */
    let filterContainer = document.querySelector(".filter-tabs");

    if(filterContainer) {

        filterContainer.addEventListener("click", function(event) {

            /* 找到被点击的那个具体按钮 */
            let currentBtn = event.target.closest(".filter-tab");

            /* 点击的不是按钮（例如点了两个按钮之间的缝隙），直接结束 */
            if(currentBtn == null) {
                return;
            }

            event.preventDefault();

            /* 取出所有标签按钮，先把它们的 active 状态全清掉 */
            let allTabs = filterContainer.querySelectorAll(".filter-tab");

            for(let i = 0; i < allTabs.length; i++) {
                allTabs[i].classList.remove("active");
            }

            /* 再给当前点击的按钮加上 active */
            currentBtn.classList.add("active");

            /* 读出按钮 data-category 属性的值 */
            let category = currentBtn.dataset.category;
            let menuItems = document.querySelectorAll(".menu-item");

            /* 遍历所有菜品，根据分类决定显示还是隐藏 */
            for(let i = 0; i < menuItems.length; i++) {

                let item = menuItems[i];

                if(category == "all") {
                    /* 选了 "全部" → 所有菜品都显示 */
                    item.classList.remove("hidden");
                } else if(item.dataset.category == category) {
                    /* 分类匹配 → 显示 */
                    item.classList.remove("hidden");
                } else {
                    /* 分类不匹配 → 隐藏 */
                    item.classList.add("hidden");
                }
            }
        });
    }


    /* ============================================================
       ── 6. 移动端导航（汉堡菜单）──
       知识点 ③：再次演示 aria-expanded 切换
       ============================================================ */
    let navToggle = document.getElementById("navToggle");
    let navLinks = document.querySelector(".nav-links");

    if(navToggle && navLinks) {

        /* 点击汉堡按钮：展开 / 收起导航 */
        navToggle.addEventListener("click", function(event) {

            navLinks.classList.toggle("open");
            /* 同时让三条横线变成 X 形 */
            navToggle.classList.toggle("open");

            /* 【无障碍核心】根据当前是否打开，同步 aria-expanded */
            if(navToggle.classList.contains("open")) {
                navToggle.setAttribute("aria-expanded", "true");
            } else {
                navToggle.setAttribute("aria-expanded", "false");
            }
        });

        /* 用户点击了导航里的某个链接后，自动收起菜单 */
        let linksInside = navLinks.querySelectorAll(".nav-link");

        for(let i = 0; i < linksInside.length; i++) {

            linksInside[i].addEventListener("click", function(event) {
                navLinks.classList.remove("open");
                navToggle.classList.remove("open");

                /* 菜单关闭了，aria-expanded 也要同步改回 false */
                navToggle.setAttribute("aria-expanded", "false");
            });
        }
    }

});
