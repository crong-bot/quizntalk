export const posts = [
    {
        slug: 'ai/cognitive/1',
        category: "AI교육",
        title: '인공지능의 인식',
        adress: 'cognitive',
        image: "/heart.png",
        list: [
            "사람과 인공지능의 인식 차이 ",
            "인공지능이 인식하는 방법"
        ],
        detail: "사람과 인공지능의 인식 차이",
        content: [
            { type: "chat2", dial: "다음 사진은 무엇일까요?", choice: "", quiztype: "" },
            { type: "cognitive11", dial: "네번째", choice: "", quiztype: "" },
            { type: "chat1", dial: "고양이요!", choice: "", quiztype: "" },
            { type: "quiz", dial: "고양이인지 어떻게 알았나요?", choice: "", quiztype: "" },
            { type: "chat1", dial: "음..그냥 사진을 보고 고양이가 떠올랐어요.", choice: "", quiztype: "" },
            { type: "chat2", dial: "그렇다면 인공지능은 눈이 없는데 어떻게 사진을 파악할까요?", choice: "", quiztype: "" },
            { type: "chat1", dial: "음...카메라가 있으면 되요!", choice: "", quiztype: "" },
            { type: "chat2", dial: "그럼 인공지능은 인간처럼 뇌가 없는데 어떻게 사진을 바로 고양이라고 알까요?", choice: "", quiztype: "" },
        ]
    },

    {
        slug: 'ai/cognitive/2',
        category: "AI교육",
        title: '인공지능의 인식',
        adress: 'ai',
        image: "/heart.png",
        list: [
            "사람과 인공지능의 인식 차이 ",
            "인공지능이 인식하는 방법"
        ],
        detail: "인공지능이 인식하는 방법",
        content: [
            {
                type: "quiz", example: {
                    one: "sdfsdf",
                    two: "twotwo",
                    three: "sdggs",
                    four: "fourfo",
                }, question: "다음 중 인공지능에서 귀의 역할을 하는 것은 무엇일까요?", quiztype: "multiple"
            },
            { type: "cognitive11", dial: "네번째", choice: "", quiztype: "" },
            { type: "chat1", dial: "고양이요!", choice: "", quiztype: "" },
            { type: "chat2", dial: "고양이인지 어떻게 알았나요?", choice: "", quiztype: "" },
            { type: "chat1", dial: "음..그냥 사진을 보고 고양이가 떠올랐어요.", choice: "", quiztype: "" },
            { type: "chat2", dial: "그렇다면 인공지능은 눈이 없는데 어떻게 사진을 파악할까요?", choice: "", quiztype: "" },
            { type: "chat1", dial: "음...카메라가 있으면 되요!", choice: "", quiztype: "" },
            { type: "chat2", dial: "그럼 인공지능은 인간처럼 뇌가 없는데 어떻게 사진을 바로 고양이라고 알까요?", choice: "", quiztype: "" },
            { type: "chat1", dial: "인공지능이 알려줘요!", choice: "", quiztype: "" },
            { type: "chat2", dial: "😖", choice: "", quiztype: "" },
            { type: "chat2", dial: "...좋아요. 일단 인공지능이 인간과 같은 뇌는 없죠?", choice: "", quiztype: "" },
            { type: "chat1", dial: "네!", choice: "", quiztype: "" },
            { type: "chat2", dial: "그럼 인공지능이 사진을 인식하는 방법은 사람과는 같지 않겠죠?", choice: "", quiztype: "" },
            { type: "chat1", dial: "맞아요!", choice: "", quiztype: "" },
            { type: "chat2", dial: "다음 시간에는 인공지능이 사진을 인식하는 방법이 사람과 어떻게 다른지 알아볼거에요!", choice: "", quiztype: "" },
        ]
    },


];
