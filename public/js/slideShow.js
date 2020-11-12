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
    ['images/Photos for ENACT platform faculty show/bland.jpg',
        'Tamara Bland',
        'Dr. Bland is a full-time Assistant Professor in Nursing and Director of the RN – BSN Program at Dominican University. She has spent many years as a staff nurse on medical/surgical, gastroenterology, and intensive care units. As a nurse she focuses on working with marginalized communities providing patient education and empowering families to participate in their plan of care. Her passion is working to increase diversity in higher education, both among faculty and students, to benefit academia and the profession of nursing. In 2020, Bland was elected to the Board of Directors of the Illinois - National League for Nursing (NLN) as President-elect. As an active member of the Illinois Nurses Association, she is dedicated to advocating for the profession of nursing and for the health of Illinois residents.'
    ],
    ['images/Photos for ENACT platform faculty show/button.jpg',
        'Mark E. Button',
        'Dr. Button has been dean of the College of Arts and Sciences at the University of Nebraska–Lincoln since 2019. He also serves as a professor of political science. Button was previously with the University of Utah, where he joined the Department of Political Science at the University of Utah in 2001, and served as the Chair of the Department of Political Science. His primary field of research is political theory, focusing on the history of political thought, ethics, and deliberative democracy. He is the author of Contract, Culture, and Citizenship: Transformative Liberalism from Hobbes to Rawls (Penn State University Press, 2008) and Political Vices (Oxford University Press 2016). Additional forthcoming works include an article on the politics of suicide, and a new study that lends empirical support to the principle of democratic impartiality. Button has taught courses in ancient and modern political theory, American political thought, philosophy of social science, ethics, and democratic theory.'
    ],

    ['images/Photos for ENACT platform faculty show/celoza.jpg',
        'Albert Celoza',
        'Dr. Celoza is the Phoenix College residential faculty in Political Science and Religious Studies.  Every semester he hosts the Phoenix Intergenerational Model United Nations Conference held at the Arizona State Legislature. Dr. Celoza is the faculty advisor of the Phoenix College Model UN Team and the Director of the Academic Certificate Program in International Studies. He was visiting faculty at Thunderbird School of Global Management and Arizona State University. His book Ferdinand Marcos and the Philippines: The Political Economy of Authoritarianism was published by Praeger. He is a member of the United Nations Association and the Arizona Interfaith Movement.'
    ],

    ['images/Photos for ENACT platform faculty show/ChandlerGarcia.jpg',
        'Lynne Chandler-Garcia',
        'Lynne Chandler-García is an assistant professor of political science at the U.S. Air Force Academy in Colorado Springs, Colorado. She teaches classes in the fields of American politics and foreign policy. Before coming to the Air Force Academy, she was a military analyst for the U.S. Army studying current operations in Iraq and Afghanistan. She is involved in local civics and serves on a number of boards in the community, believing strongly in the power of local and state politics.'
    ],

    ['images/Photos for ENACT platform faculty show/clay.jpg',
        'Charity Clay',
        'Dr. Clay is an assistant professor of Sociology and African American and Diaspora Studies at Xavier University of Louisiana. She earned her master\'s and Ph.D in Sociology from Texas A&M University and completed her undergraduate work at DePaul University as a double major in Accounting and Public Policy. She is a critical race sociologist whose work focuses on understanding the impacts of Systemic Oppression on marginalized communities with specialties in the areas of Criminal Justice and education. She is currently the head of Xavier\'s concentration in Crime and Social Justice and is developing a program built on critical research, local community involvement, and global engagement.'
    ],

    ['images/Photos for ENACT platform faculty show/cole.jpg',
        'Kathleen Cole',
        'Dr. Cole is an assistant professor of political science in the Department of Social Science at Metropolitan State University. She earned her Ph.D. in political science at the University of California at Santa Barbara. Her research is in the subfield of political philosophy and focuses on the effects of white racial identity formation and motivated cognition on political judgment. She teaches courses in American politics and political philosophy. Dr. Cole is also involved in Minnesota politics. She is a community organizer in the Twin Cities, active in the areas of racial and economic justice. She regularly publishes essays on racial justice issues in Minneapolis in MinnPost, the area’s preeminent political news outlet. She also serves on the Government Relations Council of her faculty union.'
    ],

    ['images/Photos for ENACT platform faculty show/Danley.jpg',
        'Stephen Danley',
        'Dr. Danley is an assistant professor of Public Policy and Administration at Rutgers-Camden University. His research focus includes urban neighborhoods as well as power, participation, and protest in cities. Dr. Danley founded and authors the Local Knowledge Blog, which has been featured in Next City magazine, the Philadelphia Inquirer, and Philly Magazine. The blog highlights local voice and local issues, particularly in Camden, New Jersey. Dr. Danley is an advocate for local knowledge and civic engagement as foundational to both urban policy and urban universities.'

    ],

    ['images/Photos for ENACT platform faculty show/downey.jpg',
        'Davia Downey',
        'Dr. Downey is the MPA Program Coordinator and an Associate Professor of Public Administration at Grand Valley State University in Grand Rapids, Michigan. She teaches undergraduate and graduate courses in local politics, public policy and public administration. She has sat on several community boards including, the Non-Conforming Use Committee, Community Development Advisory Committee and Housing Commission for the city of East Lansing which she currently serves as chair. She currently serves as a board member of Voters Not Politicians, the grassroots organization responsible for reforming the redistricting process in the state of Michigan in 2018.'
    ],

    ['images/Photos for ENACT platform faculty show/ellis.jpg',
        'Richard Ellis',
        'Dr. Ellis has been teaching at Washburn University in Topeka, Kansas since 1992. He came to the university with fifteen years of experience teaching special education and an additional eight years of work in alcohol and drug abuse prevention.  In addition, Dr. Ellis has been published on issues ranging from social service delivery to discrimination. Dr. Ellis currently serves as the Program Director for the LinC Scholar/Bonner Leader Program, a service learning scholarship program affiliated with The Bonner Foundation in Princeton, New Jersey.'
    ],

    ['images/Photos for ENACT platform faculty show/eno.jpg',
        'Victor Eno',
        'Dr. Eno is an Associate Professor of Political Science at Florida Agricultural & Mechanical University, where he teaches political science and public administration/policy courses at both the undergraduate and graduate levels. His fields of interest include health policy and politics, public sector governance, global health, international development, and comparative politics with a focus on Africa. Dr. Eno is an active member of the American Society for Public Administration (ASPA), and serves on the governing board of the North Florida Chapter of ASPA.'
    ],

    ['images/Photos for ENACT platform faculty show/gainous.jpg',
        'Jason Gainous',
        'Dr. Gainous is  a  professor  of political  science  at the  University  of  Louisville. His research and teaching focuses on research methods as well as information technology and politics. Along with teaching traditional classes, he has directed an internship program in the Kentucky General Assembly for 11 years. He has published 2 books, one with Oxford University Press (Tweeting to Power: The Social Media Revolution in American Politics) and  one  with  Rowman  and  Littlefield  (Rebooting  American  Politics: The  Internet Revolution). He has also published various articles in journals.'

    ],

    ['images/Photos for ENACT platform faculty show/german.jpg',
        'Myna German',
        'Dr. German is  a  professor of journalism at Delaware State University. She chaired the department for 10 years and looks forward to placing interns and majors at the state capital working on white papers for legislators. She was an American Studies major at Brandeis University and has a PhD in Mass Communications from the University of South Africa. Her thesis was on ethnicity and newspaper reading.'
    ],

    ['images/Photos for ENACT platform faculty show/gess.jpg',
        'Peter Gess',
        'Dr. Gess is Associate Provost for Engaged Learning and Director of International Programs at Hendrix College. For the former he leads the College’s distinctive Odyssey engaged learning program and other curricular and co-curricular high-impact practices. For the latter he oversees study abroad programs, international student and scholar services, ESOL programs, and special international projects, such as the Rwanda Presidential Scholars Program and the International Student Summer Institute. He is also an associate professor of politics and environmental studies and teaches courses in public administration and policy.'
    ],

    ['images/Photos for ENACT platform faculty show/glover.jpeg',
        'Robert Glover',
        'Dr. Glover is an Associate Professor of Political Science and Honors, a joint appointment at the University of Maine. He is also Co-Director of the Maine chapter of the Scholars Strategy Network. His research and teaching focus on democratic theory, community engagement, and public policy. Professor Glover is the creator of the innovative “Engaged Policy Studies Practicum” at the University of Maine, where students spend an entire year conducting engaged policy research in collaboration with community partners such as local governments and non-profit organizations. For this work, Glover has been recognized by the Maine State Legislature, Maine Campus Compact, the Center for Engaged Democracy, and the New England Resource Center for Higher Education.'
    ],

    ['images/Photos for ENACT platform faculty show/Gossett.jpg',
        'Amy Gossett',
        'Dr. Gossett is the campus director of the American Democracy Project (ADP), state government intern coordinator, and full professor of political science at Lincoln University of Missouri. Some of her most fulfilling work has been as the intern coordinator at the state capital.  She has sent over 200 students to work in all three branches of state government over the last 12 years. Many of those same interns are now state employees and elected officials requesting their own interns from Lincoln University. Her other roles include primary instructor and advisor for the Civic Engagement & Public Service Living/Learning Community, the Lloyd Gaines pre-law program, and the Pi Sigma Alpha political science honors society.'
    ],

    ['images/Photos for ENACT platform faculty show/Inderbitzin.jpg',
        'Michelle Inderbitzin',
        'Dr. Inderbitzin has been a faculty member at Oregon State University since 2001. She primarily studies and focuses her work around prison culture, juvenile justice, and transformative education. She has been published in several papers and is co-author of two textbooks on Deviant Behavior and Social Control published with Sage, and co-editor of the book, The Voluntary Sector in Prison: Encouraging Personal and Institutional Change. She regularly teaches classes and volunteers in state youth correctional facilities and Oregon’s maximum-security prison for men.'
    ],

    ['images/Photos for ENACT platform faculty show/kennedy.jpg',
        'Sheila Suess Kennedy',
        'Dr. Kennedy is a professor of Law and Public Policy at the School of Public and Environmental Affairs at Indiana University Purdue University Indianapolis, where she directs the IUPUI Center for Civic Literacy. She is a Faculty Fellow with both the Center for Religion and American Culture and the Tobias Center for Leadership Excellence, and an adjunct professor of political science. Dr. Kennedy is the author of eight book. Additionally, in 1980, she was the Republican candidate for Indiana’s then 11th Congressional District seat. Dr. Kennedy was president of Kennedy Development Services from 1987 until 1992, when she became Executive Director of the Indiana Affiliate of the American Civil Liberties Union.'
    ],

    ['images/Photos for ENACT platform faculty show/kettler.jpg',
        'Jaclyn Kettler',
        'Dr. Kettler is an assistant professor of political science at Boise State University. Kettler’s research focuses on American politics with an emphasis on state politics, political parties & interest groups, campaign finance, and women in politics. She has published research in Political Research Quarterly and The Forum: A Journal of Applied Research in Contemporary Politics. In 2015, she received the Christopher Mooney Dissertation Award for the best dissertation in American state politics completed in the previous year.'
    ],

    ['images/Photos for ENACT platform faculty show/kreitzer.jpg',
        'Rebecca Kreitzer',
        'Dr. Kreitzer is an assistant professor of public policy and an adjunct assistant professor of political science at the University of North Carolina at Chapel Hill. Her research focuses on gender, political representation, political inequality and public policy in the U.S. states. Her work has been published several journals as well as various edited volumes. She teaches undergraduate and graduate level classes on the politics of policy, public policy theory, gender and sexuality policy and interest groups.'
    ],

    ['images/Photos for ENACT platform faculty show/Kujala.jpeg',
        'Jordan Kujala',
        'Dr. Kujala is a visiting assistant professor of political science at the University of California Center Sacramento. In addition to overseeing the internship course at the UC Center, he also teaches courses on research methods, public policy, and American politics. In these courses students complete their own original research project in public policy relating to California politics. His research focuses on ideological representation in the United States including such topics as public opinion, the output of public policy, candidate decision making, elections, congress, and polarization. More specifically his current research examines the effect that primary and general elections have on the policy preferences of major party candidates for higher office, including the influential role that donor constituencies play in nomination and election of political candidates.'
    ],

    ['images/Photos for ENACT platform faculty show/ladam.jpg',
        'Christina Ladam',
        'Dr. Ladam is an assistant professor of political science at the University of Nevada, Reno. Ladam specializes in American political behavior and political methodology. Her current work uses an experimental approach to understand ways in which formal deliberative events can be structured to promote beneficial outcomes from deliberation. Other research interests include interpersonal political discussion, women and politics, state and local politics, network analysis and experiments.'
    ],

    ['images/Photos for ENACT platform faculty show/Lewis1.jpg',
        'Angela K. Lewis',
        'Dr.Lewis is Professor and Interim Chair in the Department of Political Science and Public Administration at the University of Alabama at Birmingham. Her research appears in several journals and she is the author of Conservatism in the Black Community: To the Right and Misunderstood. Dr. Lewis is on the Executive Council of the Southern Political Science Association and is one of the co-editors of the National Political Science Review.  Over the course of her career, Dr.Lewis has received numerous awards including the Anna Julia Cooper Teacher of the Year, UAB Black Student Awareness Committee Faculty Award, and the Southeastern Association of Educational Opportunity Program Personnel, TRIO Achiever Award.'
    ],

    ['images/Photos for ENACT platform faculty show/lewis.jpg',
        'Daniel C. Lewis',
        'Dr. Lewis is an associate professor of political science at Sienna College. Dr. Lewis’ work on direct democracy, minority rights, term limits, LGBT politics, the policy process, and interest groups has been published in a variety of peer-reviewed journals. His first book, Direct Democracy and Minority Rights: A Critical Review of the Tyranny of the Majority in the American States was published in 2013. His next book, The Remarkable Rise of Transgender Rights, coauthored with Jami K. Taylor and Donald Haider-Markel, is set to be published by the University of Michigan Press in the coming year. Dr. Lewis teaches American politics and public policy courses with an emphasis on political institutions.'
    ],

    ['images/Photos for ENACT platform faculty show/linch.jpeg',
        'Amy Linch',
        'Dr. Linch is an assistant teaching professor of political science and co-director of undergraduate studies at Penn State University. Dr. Linch’s research interests in political theory include early modern political thought, German idealism, Marxist and post-Marxist political thought, feminism and environmental political theory. She is particularly interested in religious toleration and the role of religious intolerance in early modern state consolidation. She has authored and edited several works on democratization in postcommunist societies, including The International Encyclopedia of Revolution and Protest 1500-Present (2009) and Justice, Hegemony and Social Movements: Views from East/Central Europe and Eurasia (2012).'
    ],

    ['images/Photos for ENACT platform faculty show/ly-donovan.jpg',
        'Carolyn Ly-Donovan',
        'Dr. Ly-Donovan is an Assistant Professor in the Department of Sociology at Augustana University. Her work explores mechanisms of inequality with particular focus on organizations and culture. She has published and engaged in projects that examine professional medical associations, archival and public libraries, and municipal fire departments. She teaches courses on inequality, organizations, gender, contemporary society, and medicine and healthcare. Dr. Ly-Donovan is a Faculty Fellow of The Yale Center for Cultural Sociology, and is currently a Mayoral appointed Commissioner on the City of Sioux Falls Disability Awareness Commission.'
    ],

    ['images/Photos for ENACT platform faculty show/mastracci.jpg',
        'Tony Mastracci',
        'Dr. Mastracci is an Associate Instructor at the University of Utah, teaching nonprofit management and theory and state and local government in the Political Science Department and Public Administration program. He has more than 20 years of experience in nonprofit operations and state and local government. Dr. Mastracci serves on several boards, including the Salt Lake City Community Development and CIP Committee and the University Neighborhood Partners Startup Incubator.'
    ],

    ['images/Photos for ENACT platform faculty show/Mead.jpg',
        'Joseph Mead',
        'Dr. Mead is an Assistant  Professor of Nonprofit Management and Public Administration at Cleveland State University, where he holds a joint appointment in the Maxine Goodman Levin College of Urban Affairs and the Cleveland-Marshall College of Law. Mead studies the law and policy of the nonprofit sector, with special focus on the interactions between nonprofit organizations and  governmental institutions. He also studies policy responses to poverty, particularly homelessness. His work with students on applied policy projects have led to changes in laws throughout Ohio. He teaches courses on nonprofit management, administrative law, state government, and policy advocacy.'
    ],

    ['images/Photos for ENACT platform faculty show/meagher.jpg',
        'Richard Meagher',
        'Dr. Meagher is Associate Professor of Political Science and Director of Social Entrepreneurship at Randolph-Macon College, where he teaches courses in American politics and political theory. His work on American conservatism and the Religious Right has appeared in numerous publications, including Political Science Quarterly, the Journal of Policy History, and New Political Science. He blogs about Virginia state and local politics at rvapol.com.'
    ],

    ['images/Photos for ENACT platform faculty show/melo.jpg',
        'Milena Andrea Melo',
        'Dr. A. Melo is an Assistant Professor of Cultural Anthropology with a specialty in Medical Anthropology at Mississippi State University. Motivated by her own experience as a DACA recipient and undocumented immigrant, Dr. Melo is committed to conducting research that reduces barriers to healthcare, confronts social inequality, and combats the disenfranchisement faced by marginalized populations in the United States. Dr. Melo’s research focuses on the experiences of undocumented Mexican immigrants accessing healthcare, specifically dialysis for end-stage renal disease caused by diabetes and hypertension. She has also been involved in research focusing on the experiences of mixed-status families and DACA in the U.S.-Mexico Borderlands.'
    ],

    ['images/Photos for ENACT platform faculty show/monteblanco.jpg',
        'Adele Dora Monteblanco',
        'Dr. Monteblanco is an assistant professor of sociology at Middle Tennessee State University. She teaches medical sociology, social policy, and research methods at both the undergraduate and graduate levels. Her fields of interest include solutions to the social vulnerability exacerbated by natural hazards, maternal health, and the scholarship of teaching and learning. Dr. Monteblanco’s articles appear in Deviant Behavior and the International Journal of Mass Emergencies and Disasters.'
    ],

    ['images/Photos for ENACT platform faculty show/Moore.jpg',
        'Colin D. Moore',
        'Dr. Moore is an Associate Professor of Political Science and Director of the Public Policy Center at the University of Hawaii. He is also the co-director of the Hawaii chapter of the Scholars Strategy Network. Professor Moore’s scholarship focuses on American political development, public bureaucracies, health policy, and the historical analysis of institutional change. His research has appeared in the American Political Science Review, Perspectives on Politics, and Studies in American Political Development, among other venues. He is the author of American Imperialism and the State: 1893 -1921(Cambridge University Press, 2017).'
    ],

    ['images/Photos for ENACT platform faculty show/myers.jpg',
        'Adam Myers',
        'Dr. Myers is an assistant professor of political science at Providence College.  He previously taught at Saint Louis University as a visiting assistant professor of political science. His research areas include state politics and political geography. In October, Myers was elected to the Governing Board of Common Cause Rhode Island, the state’s leading advocacy organization dedicated to government reform. He will be working on designing and advocating for redistricting reform legislation in the state.'
    ],

    ['images/Photos for ENACT platform faculty show/nold.jpg',
        'Susan Turner Nold',
        'Susan Turner Nold serves as Director of the Annette Strauss Institute for Civic Life in the Moody College of Communication at the University of Texas at Austin. AT UT, Susan also serves as a Senior Lecturer in the Department of Communication Studies where she teaches a class on Communicating to Government. Before joining the Strauss Institute, Susan was General Counsel to Texas Senator Kirk Watson and a Staff Attorney for the Texas Sunset Advisory Commission. Prior to working in the Texas Capitol, Susan practiced law as a Litigation Associate at Bracewell & Giuliani, volunteered as a Congressional Affairs Liaison for a presidential campaign, and worked in development for a political committee in Washington D.C.'
    ],

    ['images/Photos for ENACT platform faculty show/owens1.jpg',
        'Katharine Owens',
        'Katharine Owens is an Associate Professor in the Department of Politics Economics, and International Studies and the Director of University Interdisciplinary Studies at the University of Hartford. She teaches courses in American government, research methods, and public policy, particularly environmental policy.She researches the way policy is implemented and the impact it has in the world. Past projects have measured the effect of campus sustainability initiatives, evaluated how people make decisions about water resources, and examined collaboration of stakeholders in sustainability projects abroad. Currently, she examines the impact of active and engaged teaching methods on student learning, including experiential learning, universal design for learning, and arts-based learning.'
    ],

    ['images/Photos for ENACT platform faculty show/pimpare.jpg',
        'Stephen Pimpare',
        'Dr. Pimpare is a Senior Lecturer in Politics & Society and a Fellow at the Carsey School of Public Policy at the University of New Hampshire. His second book, A People\'s History of Poverty in America, received the Michael Harrington Award from the American Political Science Association, “for a book that demonstrates how scholarship can be used in the struggle for a better world." His newest book, Ghettoes, Tramps, and Welfare Queens: Down & Out on the Silver Screen, was published by Oxford University Press in 2017. Dr. Pimpare previously served as a senior-level administrator of not-for-profit direct service and advocacy organizations addressing issues of poverty, hunger, and homelessness throughout New York City. One of the programs he helped to create, One City Café, New York’s first non-profit restaurant, was hailed by the New York Times as “the reinvention of the soup kitchen” and received the Victory Against Hunger Award from the United States Congressional Hunger Center.'
    ],

    ['images/Photos for ENACT platform faculty show/Rich.jpg',
        'Michael J. Rich',
        'Dr. Rich is Professor of Political Science and Environmental Sciences, and Director of the Policy Analysis Laboratory at Emory University. He is the author of Collaborative Governance for Urban Revitalization (with Robert Stoker) and Federal Policy making and the Poor. His current research focuses on community building, neighborhood revitalization and local poverty reduction strategies.  He has recently completed evaluation studies of  the Atlanta Housing Authority’s Moving to Work Demonstration to assess the effects of public housing innovations on the well-being of low-and moderate-income families and their children and Atlanta CareerRise, a regional workforce development collaborative designed to meet the needs of both employers and low-income incumbent workers and job seekers. He teaches courses on public policy, public policy analysis, community building and social change, poverty in America, and qualitative and multimethod research, among others.'
    ],

    ['images/Photos for ENACT platform faculty show/Rouse.jpg',
        'Stella M. Rouse',
        'Dr. Rouse is an Associate Professor in the Department of Government and Politics, Director of the Center for American Politics and Citizenship, and Associate Director of the University of Maryland Critical Issues Poll at the University of Maryland.Dr. Rouse’s research and teaching interests focus on Latino politics, minority politics, Millennial politics, state politics, and immigration. She is the author of the book, Latinos in the Legislative Process: Interests and Influence (Cambridge University Press, 2013), which was voted as one of the best political science books of 2013 by The Huffington Post. Her second book, The Politics of Millennials: Political Beliefs and Policy Preferences of America’s Most Diverse Generation (co-authored with Ashley Ross), is forthcoming in 2018. She has published articles on group dynamics and cosponsorship, religion and ethno-racial political attitudes, Latino representation and education, and Millennials and immigration.'
    ],

    ['images/Photos for ENACT platform faculty show/scattergood.jpg',
        'Wendy Scattergood',
        'Wendy Scattergood is an Assistant Professor of Political Science and an analyst for the St. Norbert College Strategic Research Institute at St. Norbert College in Wisconsin. She writes, analyzes, and publishes research based on the Wisconsin Survey, which has been published by most major national news outlets. She has been interviewed on PBS Newshour, has blogged for the London School of Economics, as well as is a frequent guest on local and state news programs. Her research has focused on Wisconsin Politics, but covers a wide variety of topics, from elections to public policy issues facing the state and nation, to climate change, to conspiracy theories. Dr. Scattergood teaches courses in state and local politics, policy analysis, public administration, environmental politics, political extremism and polarization.'
    ],

    ['images/Photos for ENACT platform faculty show/scully.png',
        'Eileen Scully',
        'Dr. Scully has taught at Bennington College (VT) since 2000. Her interdisciplinary courses combine history, law, politics, public action, and local governance. A scholar of American and international history, Scully is the author of Bargaining with the State from Afar: American Citizenship in Treaty Port China. She has published articles and reviews in The Journal of American History, International History Review, Pacific Historical Review, The Journal of Modern History, and The American Historical Review. An SSRC-MacArthur Foundation Fellowship in International Peace and Security took her to Harvard Law School and to the Henry Dunant Institute in Geneva, Switzerland, and for six years she taught at Princeton University. Her most recent work combines international law and American foreign policy, with an article on human trafficking and an essay The U.S. and International Affairs,1789-1919, commissioned for The Cambridge History of Law in America. Scully is the recipient of the 2005 Eugene Ascher Distinguished Teaching Prize, awarded annually by the American Historical Association.'
    ],

    ['images/Photos for ENACT platform faculty show/slack.jpg',
        'James D. Slack',
        'Dr. Slack is a professor in the Department of Public Policy and Administration, College of Public Service, at Jackson State University. Dr. Slack is a licensed (NCCA) pastoral counselor working with the homeless, women who are victims of human trafficking, and men on death row. Dr. Slack’s research centers on ethics and the intimate consequences of public policy, specifically Death Policy in the U.S. He is author of two editions of Abortion, Execution, and the Consequences of Taking Life (Transaction). He also writes in the area of workplace discrimination and health/disabilities policy. He is author of two editions of HIV/AIDS and the Public Workplace (University of Alabama Press). Dr. Slack won the national Laverne Burchfield Award for his PAR article, “The Public Administration of AIDS.” To date, Dr. Slack is author or co-author of eight books and approximately 55 articles and book chapters.'
    ],

    ['images/Photos for ENACT platform faculty show/Smith.jpeg',
        'Candis Watts Smith',
        'Dr. Smith is Associate Professor of Political Science and African American Studies at Penn State University. Her research centers on American political behavior, with an emphasis on race, ethnicity, and inequality. Here, she focuses on individuals’ and groups’ policy preferences, particularly around social policies that exacerbate or ameliorate disparities and inequality between groups. Dr. Smith is the author Black Mosaic: The Politics of Black Pan-Ethnic Diversity (NYU Press, 2014), and co-author of both Stay Woke: A People\'s Guide to Making All Black Lives Matter (NYU Press, 2019) and Racial Stasis: The Millennial Generation and the Stagnation of Racial Attitudes in American Politics (University of Chicago Press, 2020.'
    ],

    ['images/Photos for ENACT platform faculty show/stimell.jpeg',
        'Melissa Stimell',
        'Melissa Stimell is a Professor of the Practice in the Legal Studies Program at Brandeis University, and Interim Director of the International Center for Ethics, Justice and Public Life. She is Academic Program Director of ENACT, which is a national expansion of an initiative she spearheaded at Brandeis with her course "Advocacy for Policy Change." She is the director of the internship programs for the Legal Studies Program and chair of the Program in Social Justice and Social Policy. She currently teaches Advocacy for Policy Change, Conflict Analysis and Intervention, and the seminars accompanying the internship programs. She received her undergraduate degree from Cornell University and her law degree from Boston University School of Law. She has been a public interest attorney for over 30 years, focusing on the representation of vulnerable populations in such areas as, criminal law, discrimination of individuals with disabilities, and child welfare.'
    ],

    ['images/Photos for ENACT platform faculty show/Vandegrift1.jpg',
        'Darcie Vandegrift',
        'Dr. Vandegrift is Professor of Sociology in the Department for the Study of Culture and Society at Drake University. She has led students in extensive civic engagement and service learning through her courses in Global Youth Studies, Sociology of Childhood, Research Methods, and Social Stratification.  She has published on youth studies in global contexts, and creates collaborative projects with youth to tell their stories about immigration, refugee, and community experiences. Dr. Vandegrift\'s research is in the area of youth studies, examining how young people navigate the new political, educational, economic and social landscapes of globalization in everyday life.  She also has published community-based evaluation research with Des Moines stakeholders. Her recent publications explore digital satire, Latin American youth politics and how U.S. students consider multiculturalism and internationalization.'
    ],

    ['images/Photos for ENACT platform faculty show/venters.jpg',
        'Louis Venters',
        'Dr. Venters is an Associate Professor of History at Francis Marion University and a consultant in the fields of historic preservation and cultural resource management. His work inside and outside the academy focuses on histories of race, religion, and social change in the United States; issues of equity and sustainability in rural and urban planning; heritage tourism, historical memory, and cultural and environmental stewardship; and the empowerment of young people and historically disadvantaged communities.Dr. Venters teaches courses in African and African diaspora history, southern U.S. history, and public history and an interdisciplinary Introduction to African & African American Studies. He is the author of two monographs, No Jim Crow Church: The Origins of South Carolina’s Bahá’í Community (University Press of Florida, 2015) and A History of the Bahá’í Faith in South Carolina (History Press, 2019). He is a member of the board of directors of Preservation South Carolina. He writes on issues related to race, religion, history, and culture at louisventers.com.'
    ],

    ['images/Photos for ENACT platform faculty show/wood.jpg',
        'Zachary D. Wood',
        'Dr. Wood is an Assistant Professor in the Institute of Public Service at Seattle University, primarily assigned to the undergraduate Public Affairs program. Wood’s primary research focuses on issues of urban poverty and social change through civic engagement and political advocacy. Much of his recent research explores the role of non-profits as advocates for social change, and how the traditional non-profit service delivery model has often engaged in system-conforming behavior as opposed to system-transformation behavior, with significant and potentially problematic effects for their constituents. Wood is a tireless advocate for social change and marginalized populations. He has a passion for analyzing social issues and finding new solutions, which has contributed to his constant quest for a deeper knowledge about the complexities of our most challenging social crises.'
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
