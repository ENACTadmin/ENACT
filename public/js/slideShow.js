let imagePaths = [
    'images/Photos for ENACT platform slideshow/advocacysized.jpg',
    'images/Photos for ENACT platform slideshow/DSC_0504_B.jpg',
    'images/Photos for ENACT platform slideshow/DSC_5099.JPG',
    'images/Photos for ENACT platform slideshow/ENACT_2018_Institute_State_House.jpg',
    'images/Photos for ENACT platform slideshow/ENACT_Womens_Forum_2018.jpg',
    'images/Photos for ENACT platform slideshow/Eno.png',
    'images/Photos for ENACT platform slideshow/Gainous_Inderbitzin_with_Student_2018-2.jpg',
    'images/Photos for ENACT platform slideshow/in front of MS Capitol 2.jpeg',
    'images/Photos for ENACT platform slideshow/Kathleen Cole.JPG',
    'images/Photos for ENACT platform slideshow/kaufmanandross.png',
    'images/Photos for ENACT platform slideshow/Sgt Brown_edit.jpg',
    'images/Photos for ENACT platform slideshow/Smith_Danley_Quinn.jpg'
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
    ],
    ['images/Photos for ENACT platform faculty show/anthony.jpg',
        'Joseph Anthony',
        'Dr. Joseph Anthony is a Visiting Assistant Professor in the department of Political Science at' +
        'Oklahoma State University. Dr. Anthony researches elections administration, voting rights, social' +
        'movements, political parties, and voting behavior.'
    ]
]

let labels = [
    'Students in Brandeis University\'s ENACT course meet at the Massachusetts State House with (now former) Representative Byron Rushing.',
    'ENACT Faculty Fellow Rob Glover of the Universuty of Maine (right) and former student  Harold "Trey" Stewart III, now a Maine State Representative, at the ENACT booth at the 2017 National COnference of State Legislatures Annual Legislative Summit.',
    'Brandeis ENACT students Francesca Pinto \'17 and Matthew Yan \'17 listen to Ashley Morales \'17 during the 2017 Brandeis "Present and Defend" presentation.',
    'Community members and ENACT students participate in "Present and Defend" at Drake University in Iowa.',
    'ENACT Faulty Fellow James Slack and his studenst during a visit to the Mississippi State Capitol Building.',
    'Now former State Senator Richard Ross (R) and State Representative Jay Kaufman (D) speak to ENACT students at the Massachusetts State House.',
    'ENACT Faculty Fellow Victor Eno of Florida Agricultural and Mechanical University participating in the ENACT Institute.',
    'Professor Kathleen Cole of Metropolitan State University in Minneapolis, Minnesota, discusses the ENACT program with fellow ENACT Faculty Fellows.',
    'Women\'s Engagement in Politics Forum: ENACT Academic Program Director Melissa Stimell, Mass. State Senator Cindy Friedman and Former New Hampshire Speaker of the House Terie Norelli (L-R).',
    'ENACT Faculty Fellows speak with a legislative aide during a visit to the MAssachusetts State House.',
    'Brandeis ENACT student Max Everson shares his ENACT experience with ENACT Faulty Fellows Michelle Inderbitzin of Oregon State and Jason Gainous of the University of Louisville.',
    'ENACT Faculty Fellows at the Massachusetts State House with legislators and staff.'
]

exports.getPath = (info) => {
    if (info === 'slideShow')
        return imagePaths
    else if (info === 'label')
        return labels
    else
        return bioPaths
}
