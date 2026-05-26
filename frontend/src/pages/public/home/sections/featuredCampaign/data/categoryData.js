import {
    TbHeartFilled,
    TbAlertTriangle,
    TbMedicalCross,
    TbSoup,
    TbBook,
    TbHomeBolt,
    TbUsers,
    TbLeaf,
} from 'react-icons/tb';

const categoryData = [
    {
        id: 1,
        title: "Most Crucial",
        slug: "most-crucial",
        description: "Top priority campaigns",
        icon: TbHeartFilled,
        count: 12,
    },
    {
        id: 2,
        title: "Emergency Relief",
        slug: "emergency-relief",
        description: "Help in times of crisis",
        icon: TbAlertTriangle,
        count: 18,
    },
    {
        id: 3,
        title: "Medical Support",
        slug: "medical-support",
        description: "Healthcare for all",
        icon: TbMedicalCross,
        count: 14,
    },
    // {
    //     id: 4,
    //     title: "Food & Nutrition",
    //     slug: "food-nutrition",
    //     description: "No one should go hungry",
    //     icon: TbSoup,
    //     count: 20,
    // },
    // {
    //     id: 5,
    //     title: "Education",
    //     slug: "education",
    //     description: "Learning for a better future",
    //     icon: TbBook,
    //     count: 16,
    // },
    {
        id: 6,
        title: "Disaster Relief",
        slug: "disaster-relief",
        description: "Rebuild lives & communities",
        icon: TbHomeBolt,
        count: 11,
    },
    {
        id: 7,
        title: "Children & Family",
        slug: "children-family",
        description: "Support kids & families",
        icon: TbUsers,
        count: 13,
    },
    // {
    //     id: 8,
    //     title: "Environment",
    //     slug: "environment",
    //     description: "Protect our planet",
    //     icon: TbLeaf,
    //     count: 9,
    // },
];

export default categoryData;