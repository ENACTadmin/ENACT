let imagePaths = [
    'images/Photos for ENACT platform slideshow/DSC_0504_B.jpg',
    'images/Photos for ENACT platform slideshow/DSC_5099.JPG',
    'images/Photos for ENACT platform slideshow/ENACT_2018_Institute_State_House.jpg',
    'images/Photos for ENACT platform slideshow/ENACT_Womens_Forum_2018.jpg',
    'images/Photos for ENACT platform slideshow/Eno.png',
    'images/Photos for ENACT platform slideshow/Gainous_Inderbitzin_with_Student_2018-2.jpg',
    'images/Photos for ENACT platform slideshow/Kathleen Cole.JPG',
    'images/Photos for ENACT platform slideshow/Sgt Brown_edit.jpg',
    'images/Photos for ENACT platform slideshow/Smith_Danley_Quinn.jpg',
    'images/Photos for ENACT platform slideshow/advocacysized.jpg',
    'images/Photos for ENACT platform slideshow/in front of MS Capitol 2.jpeg',
    'images/Photos for ENACT platform slideshow/kaufmanandross.png'
]

let bioPaths = [
    ['images/Photos for ENACT platform faculty show/anthony.jpg',
        'Joseph Anthony',
        'Dr. Joseph Anthony is a Visiting Assistant Professor in the department of Political Science at' +
        'Oklahoma State University. Dr. Anthony researches elections administration, voting rights, social' +
        'movements, political parties, and voting behavior.'
    ],
    ['images/Photos for ENACT platform faculty show/barth.jpg',
        'Jay Barth',
        'Jay Barth is M.E. and Ima Graves Peace Professor of Politics, Director of the Odyssey Program,' +
        ' and Director of Civic Engagement Projects at Hendrix College. Barth’s academic work includes' +
        ' research on the politics of the South, state government and politics, LGBT politics, political' +
        ' communication (particularly radio advertising), and the achievement gap in Arkansas.'
    ],
    ['images/Photos for ENACT platform faculty show/baumann.jpg',
        'Zachary D. Baumann',
        'Zachary D. Baumann is an Assistant Professor of Political Science at Nebraska Wesleyan University.' +
        ' His teaching and research interests lie in the field of American politics, focusing primarily on' +
        ' state government and policy, elections, and effective pedagogy.'
    ]
]

exports.getPath = (info) => {
    if (info === 'slideShow')
        return imagePaths
    else
        return bioPaths
}
