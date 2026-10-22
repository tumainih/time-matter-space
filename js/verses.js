const VERSES = [
  {
    "book": "Genesis",
    "chapter": 15,
    "verse": 6,
    "theme": "faith",
    "text": "And he believed in the LORD; and he counted it to him for righteousness."
  },
  {
    "book": "Joshua",
    "chapter": 1,
    "verse": 9,
    "theme": "faith",
    "text": "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."
  },
  {
    "book": "Psalm",
    "chapter": 28,
    "verse": 7,
    "theme": "faith",
    "text": "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him."
  },
  {
    "book": "Psalm",
    "chapter": 56,
    "verse": 3,
    "theme": "faith",
    "text": "What time I am afraid, I will trust in thee."
  },
  {
    "book": "Psalm",
    "chapter": 62,
    "verse": 8,
    "theme": "faith",
    "text": "Trust in him at all times; ye people, pour out your heart before him: God is a refuge for us."
  },
  {
    "book": "Proverbs",
    "chapter": 3,
    "verse": 5,
    "theme": "faith",
    "text": "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
  },
  {
    "book": "Proverbs",
    "chapter": 3,
    "verse": 6,
    "theme": "faith",
    "text": "In all thy ways acknowledge him, and he shall direct thy paths."
  },
  {
    "book": "Isaiah",
    "chapter": 12,
    "verse": 2,
    "theme": "faith",
    "text": "Behold, God is my salvation; I will trust, and not be afraid: for the LORD JEHOVAH is my strength and my song; he also is become my salvation."
  },
  {
    "book": "Isaiah",
    "chapter": 26,
    "verse": 3,
    "theme": "faith",
    "text": "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee."
  },
  {
    "book": "Isaiah",
    "chapter": 41,
    "verse": 10,
    "theme": "faith",
    "text": "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."
  },
  {
    "book": "Isaiah",
    "chapter": 41,
    "verse": 13,
    "theme": "faith",
    "text": "For I the LORD thy God will hold thy right hand, saying unto thee, Fear not; I will help thee."
  },
  {
    "book": "Isaiah",
    "chapter": 43,
    "verse": 2,
    "theme": "faith",
    "text": "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee."
  },
  {
    "book": "Matthew",
    "chapter": 17,
    "verse": 20,
    "theme": "faith",
    "text": "And Jesus said unto them, Because of your unbelief: for verily I say unto you, If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you."
  },
  {
    "book": "Matthew",
    "chapter": 21,
    "verse": 22,
    "theme": "faith",
    "text": "And all things, whatsoever ye shall ask in prayer, believing, ye shall receive."
  },
  {
    "book": "Mark",
    "chapter": 9,
    "verse": 23,
    "theme": "faith",
    "text": "Jesus said unto him, If thou canst believe, all things are possible to him that believeth."
  },
  {
    "book": "Mark",
    "chapter": 11,
    "verse": 24,
    "theme": "faith",
    "text": "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them."
  },
  {
    "book": "Romans",
    "chapter": 1,
    "verse": 17,
    "theme": "faith",
    "text": "For therein is the righteousness of God revealed from faith to faith: as it is written, The just shall live by faith."
  },
  {
    "book": "Romans",
    "chapter": 5,
    "verse": 1,
    "theme": "faith",
    "text": "Therefore being justified by faith, we have peace with God through our Lord Jesus Christ."
  },
  {
    "book": "Romans",
    "chapter": 10,
    "verse": 17,
    "theme": "faith",
    "text": "So then faith cometh by hearing, and hearing by the word of God."
  },
  {
    "book": "2 Corinthians",
    "chapter": 5,
    "verse": 7,
    "theme": "faith",
    "text": "For we walk by faith, not by sight."
  },
  {
    "book": "Galatians",
    "chapter": 2,
    "verse": 20,
    "theme": "faith",
    "text": "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me."
  },
  {
    "book": "Ephesians",
    "chapter": 2,
    "verse": 8,
    "theme": "faith",
    "text": "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God."
  },
  {
    "book": "Philippians",
    "chapter": 1,
    "verse": 6,
    "theme": "faith",
    "text": "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ."
  },
  {
    "book": "Philippians",
    "chapter": 4,
    "verse": 13,
    "theme": "faith",
    "text": "I can do all things through Christ which strengtheneth me."
  },
  {
    "book": "Hebrews",
    "chapter": 11,
    "verse": 1,
    "theme": "faith",
    "text": "Now faith is the substance of things hoped for, the evidence of things not seen."
  },
  {
    "book": "Hebrews",
    "chapter": 11,
    "verse": 6,
    "theme": "faith",
    "text": "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him."
  },
  {
    "book": "James",
    "chapter": 1,
    "verse": 3,
    "theme": "faith",
    "text": "Knowing this, that the trying of your faith worketh patience."
  },
  {
    "book": "James",
    "chapter": 1,
    "verse": 6,
    "theme": "faith",
    "text": "But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed."
  },
  {
    "book": "1 Peter",
    "chapter": 1,
    "verse": 7,
    "theme": "faith",
    "text": "That the trial of your faith, being much more precious than of gold that perisheth, though it be tried with fire, might be found unto praise and honour and glory at the appearing of Jesus Christ."
  },
  {
    "book": "1 John",
    "chapter": 5,
    "verse": 4,
    "theme": "faith",
    "text": "For whatsoever is born of God overcometh the world: and this is the victory that overcometh the world, even our faith."
  },
  {
    "book": "Psalm",
    "chapter": 31,
    "verse": 24,
    "theme": "hope",
    "text": "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD."
  },
  {
    "book": "Psalm",
    "chapter": 33,
    "verse": 18,
    "theme": "hope",
    "text": "Behold, the eye of the LORD is upon them that fear him, upon them that hope in his mercy."
  },
  {
    "book": "Psalm",
    "chapter": 39,
    "verse": 7,
    "theme": "hope",
    "text": "And now, Lord, what wait I for? my hope is in thee."
  },
  {
    "book": "Psalm",
    "chapter": 42,
    "verse": 5,
    "theme": "hope",
    "text": "Why art thou cast down, O my soul? and why art thou disquieted in me? hope thou in God: for I shall yet praise him for the help of his countenance."
  },
  {
    "book": "Psalm",
    "chapter": 71,
    "verse": 5,
    "theme": "hope",
    "text": "For thou art my hope, O Lord GOD: thou art my trust from my youth."
  },
  {
    "book": "Psalm",
    "chapter": 130,
    "verse": 5,
    "theme": "hope",
    "text": "I wait for the LORD, my soul doth wait, and in his word do I hope."
  },
  {
    "book": "Psalm",
    "chapter": 146,
    "verse": 5,
    "theme": "hope",
    "text": "Happy is he that hath the God of Jacob for his help, whose hope is in the LORD his God."
  },
  {
    "book": "Proverbs",
    "chapter": 23,
    "verse": 18,
    "theme": "hope",
    "text": "For surely there is an end; and thine expectation shall not be cut off."
  },
  {
    "book": "Isaiah",
    "chapter": 40,
    "verse": 31,
    "theme": "hope",
    "text": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
  },
  {
    "book": "Jeremiah",
    "chapter": 29,
    "verse": 11,
    "theme": "hope",
    "text": "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."
  },
  {
    "book": "Lamentations",
    "chapter": 3,
    "verse": 22,
    "theme": "hope",
    "text": "It is of the LORD's mercies that we are not consumed, because his compassions fail not."
  },
  {
    "book": "Lamentations",
    "chapter": 3,
    "verse": 23,
    "theme": "hope",
    "text": "They are new every morning: great is thy faithfulness."
  },
  {
    "book": "Lamentations",
    "chapter": 3,
    "verse": 24,
    "theme": "hope",
    "text": "The LORD is my portion, saith my soul; therefore will I hope in him."
  },
  {
    "book": "Romans",
    "chapter": 5,
    "verse": 5,
    "theme": "hope",
    "text": "And hope maketh not ashamed; because the love of God is shed abroad in our hearts by the Holy Ghost which is given unto us."
  },
  {
    "book": "Romans",
    "chapter": 8,
    "verse": 24,
    "theme": "hope",
    "text": "For we are saved by hope: but hope that is seen is not hope: for what a man seeth, why doth he yet hope for?"
  },
  {
    "book": "Romans",
    "chapter": 8,
    "verse": 25,
    "theme": "hope",
    "text": "But if we hope for that we see not, then do we with patience wait for it."
  },
  {
    "book": "Romans",
    "chapter": 12,
    "verse": 12,
    "theme": "hope",
    "text": "Rejoicing in hope; patient in tribulation; continuing instant in prayer."
  },
  {
    "book": "Romans",
    "chapter": 15,
    "verse": 13,
    "theme": "hope",
    "text": "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost."
  },
  {
    "book": "2 Corinthians",
    "chapter": 4,
    "verse": 17,
    "theme": "hope",
    "text": "For our light affliction, which is but for a moment, worketh for us a far more exceeding and eternal weight of glory."
  },
  {
    "book": "2 Corinthians",
    "chapter": 4,
    "verse": 18,
    "theme": "hope",
    "text": "While we look not at the things which are seen, but at the things which are not seen: for the things which are seen are temporal; but the things which are not seen are eternal."
  },
  {
    "book": "Hebrews",
    "chapter": 6,
    "verse": 19,
    "theme": "hope",
    "text": "Which hope we have as an anchor of the soul, both sure and stedfast, and which entereth into that within the veil."
  },
  {
    "book": "Hebrews",
    "chapter": 10,
    "verse": 23,
    "theme": "hope",
    "text": "Let us hold fast the profession of our faith without wavering; for he is faithful that promised."
  },
  {
    "book": "1 Peter",
    "chapter": 1,
    "verse": 3,
    "theme": "hope",
    "text": "Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead."
  },
  {
    "book": "1 Peter",
    "chapter": 1,
    "verse": 13,
    "theme": "hope",
    "text": "Wherefore gird up the loins of your mind, be sober, and hope to the end for the grace that is to be brought unto you at the revelation of Jesus Christ."
  },
  {
    "book": "1 Peter",
    "chapter": 5,
    "verse": 7,
    "theme": "hope",
    "text": "Casting all your care upon him; for he careth for you."
  },
  {
    "book": "1 John",
    "chapter": 3,
    "verse": 2,
    "theme": "hope",
    "text": "Beloved, now are we the sons of God, and it doth not yet appear what we shall be: but we know that, when he shall appear, we shall be like him; for we shall see him as he is."
  },
  {
    "book": "1 John",
    "chapter": 3,
    "verse": 3,
    "theme": "hope",
    "text": "And every man that hath this hope in him purifieth himself, even as he is pure."
  },
  {
    "book": "Deuteronomy",
    "chapter": 7,
    "verse": 9,
    "theme": "love",
    "text": "Know therefore that the LORD thy God, he is God, the faithful God, which keepeth covenant and mercy with them that love him and keep his commandments to a thousand generations."
  },
  {
    "book": "Psalm",
    "chapter": 36,
    "verse": 7,
    "theme": "love",
    "text": "How excellent is thy lovingkindness, O God! therefore the children of men put their trust under the shadow of thy wings."
  },
  {
    "book": "Psalm",
    "chapter": 103,
    "verse": 8,
    "theme": "love",
    "text": "The LORD is merciful and gracious, slow to anger, and plenteous in mercy."
  },
  {
    "book": "Psalm",
    "chapter": 117,
    "verse": 2,
    "theme": "love",
    "text": "For his merciful kindness is great toward us: and the truth of the LORD endureth for ever. Praise ye the LORD."
  },
  {
    "book": "Psalm",
    "chapter": 136,
    "verse": 1,
    "theme": "love",
    "text": "O give thanks unto the LORD; for he is good: for his mercy endureth for ever."
  },
  {
    "book": "Proverbs",
    "chapter": 10,
    "verse": 12,
    "theme": "love",
    "text": "Hatred stirreth up strifes: but love covereth all sins."
  },
  {
    "book": "Proverbs",
    "chapter": 17,
    "verse": 17,
    "theme": "love",
    "text": "A friend loveth at all times, and a brother is born for adversity."
  },
  {
    "book": "Song of Solomon",
    "chapter": 8,
    "verse": 7,
    "theme": "love",
    "text": "Many waters cannot quench love, neither can the floods drown it: if a man would give all the substance of his house for love, it would utterly be contemned."
  },
  {
    "book": "Isaiah",
    "chapter": 54,
    "verse": 10,
    "theme": "love",
    "text": "For the mountains shall depart, and the hills be removed; but my kindness shall not depart from thee, neither shall the covenant of my peace be removed, saith the LORD that hath mercy on thee."
  },
  {
    "book": "Jeremiah",
    "chapter": 31,
    "verse": 3,
    "theme": "love",
    "text": "The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee."
  },
  {
    "book": "Zephaniah",
    "chapter": 3,
    "verse": 17,
    "theme": "love",
    "text": "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing."
  },
  {
    "book": "Matthew",
    "chapter": 5,
    "verse": 44,
    "theme": "love",
    "text": "But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you."
  },
  {
    "book": "Matthew",
    "chapter": 22,
    "verse": 37,
    "theme": "love",
    "text": "Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind."
  },
  {
    "book": "Matthew",
    "chapter": 22,
    "verse": 39,
    "theme": "love",
    "text": "And the second is like unto it, Thou shalt love thy neighbour as thyself."
  },
  {
    "book": "Mark",
    "chapter": 12,
    "verse": 30,
    "theme": "love",
    "text": "And thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind, and with all thy strength: this is the first commandment."
  },
  {
    "book": "John",
    "chapter": 3,
    "verse": 16,
    "theme": "love",
    "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
  },
  {
    "book": "John",
    "chapter": 13,
    "verse": 34,
    "theme": "love",
    "text": "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another."
  },
  {
    "book": "John",
    "chapter": 13,
    "verse": 35,
    "theme": "love",
    "text": "By this shall all men know that ye are my disciples, if ye have love one to another."
  },
  {
    "book": "John",
    "chapter": 15,
    "verse": 12,
    "theme": "love",
    "text": "This is my commandment, That ye love one another, as I have loved you."
  },
  {
    "book": "John",
    "chapter": 15,
    "verse": 13,
    "theme": "love",
    "text": "Greater love hath no man than this, that a man lay down his life for his friends."
  },
  {
    "book": "Romans",
    "chapter": 5,
    "verse": 8,
    "theme": "love",
    "text": "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."
  },
  {
    "book": "Romans",
    "chapter": 8,
    "verse": 35,
    "theme": "love",
    "text": "Who shall separate us from the love of Christ? shall tribulation, or distress, or persecution, or famine, or nakedness, or peril, or sword?"
  },
  {
    "book": "Romans",
    "chapter": 8,
    "verse": 38,
    "theme": "love",
    "text": "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come."
  },
  {
    "book": "Romans",
    "chapter": 8,
    "verse": 39,
    "theme": "love",
    "text": "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord."
  },
  {
    "book": "Romans",
    "chapter": 13,
    "verse": 8,
    "theme": "love",
    "text": "Owe no man any thing, but to love one another: for he that loveth another hath fulfilled the law."
  },
  {
    "book": "Romans",
    "chapter": 13,
    "verse": 10,
    "theme": "love",
    "text": "Love worketh no ill to his neighbour: therefore love is the fulfilling of the law."
  },
  {
    "book": "1 Corinthians",
    "chapter": 13,
    "verse": 2,
    "theme": "love",
    "text": "And though I have the gift of prophecy, and understand all mysteries, and all knowledge; and though I have all faith, so that I could remove mountains, and have not charity, I am nothing."
  },
  {
    "book": "1 Corinthians",
    "chapter": 13,
    "verse": 4,
    "theme": "love",
    "text": "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up."
  },
  {
    "book": "1 Corinthians",
    "chapter": 13,
    "verse": 7,
    "theme": "love",
    "text": "Beareth all things, believeth all things, hopeth all things, endureth all things."
  },
  {
    "book": "1 Corinthians",
    "chapter": 13,
    "verse": 8,
    "theme": "love",
    "text": "Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away."
  },
  {
    "book": "1 Corinthians",
    "chapter": 13,
    "verse": 13,
    "theme": "love",
    "text": "And now abideth faith, hope, charity, these three; but the greatest of these is charity."
  },
  {
    "book": "1 Corinthians",
    "chapter": 16,
    "verse": 14,
    "theme": "love",
    "text": "Let all your things be done with charity."
  },
  {
    "book": "Galatians",
    "chapter": 5,
    "verse": 22,
    "theme": "love",
    "text": "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith."
  },
  {
    "book": "Ephesians",
    "chapter": 3,
    "verse": 17,
    "theme": "love",
    "text": "That Christ may dwell in your hearts by faith; that ye, being rooted and grounded in love."
  },
  {
    "book": "Ephesians",
    "chapter": 3,
    "verse": 18,
    "theme": "love",
    "text": "May be able to comprehend with all saints what is the breadth, and length, and depth, and height."
  },
  {
    "book": "Ephesians",
    "chapter": 3,
    "verse": 19,
    "theme": "love",
    "text": "And to know the love of Christ, which passeth knowledge, that ye might be filled with all the fulness of God."
  },
  {
    "book": "Ephesians",
    "chapter": 4,
    "verse": 2,
    "theme": "love",
    "text": "With all lowliness and meekness, with longsuffering, forbearing one another in love."
  },
  {
    "book": "Ephesians",
    "chapter": 4,
    "verse": 32,
    "theme": "love",
    "text": "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you."
  },
  {
    "book": "Ephesians",
    "chapter": 5,
    "verse": 2,
    "theme": "love",
    "text": "And walk in love, as Christ also hath loved us, and hath given himself for us an offering and a sacrifice to God for a sweetsmelling savour."
  },
  {
    "book": "Philippians",
    "chapter": 1,
    "verse": 9,
    "theme": "love",
    "text": "And this I pray, that your love may abound yet more and more in knowledge and in all judgment."
  },
  {
    "book": "Colossians",
    "chapter": 3,
    "verse": 14,
    "theme": "love",
    "text": "And above all these things put on charity, which is the bond of perfectness."
  },
  {
    "book": "1 Thessalonians",
    "chapter": 5,
    "verse": 11,
    "theme": "love",
    "text": "Wherefore comfort yourselves together, and edify one another, even as also ye do."
  },
  {
    "book": "Hebrews",
    "chapter": 13,
    "verse": 1,
    "theme": "love",
    "text": "Let brotherly love continue."
  },
  {
    "book": "1 Peter",
    "chapter": 4,
    "verse": 8,
    "theme": "love",
    "text": "And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins."
  },
  {
    "book": "1 John",
    "chapter": 3,
    "verse": 1,
    "theme": "love",
    "text": "Behold, what manner of love the Father hath bestowed upon us, that we should be called the sons of God: therefore the world knoweth us not, because it knew him not."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 7,
    "theme": "love",
    "text": "Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 8,
    "theme": "love",
    "text": "He that loveth not knoweth not God; for God is love."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 9,
    "theme": "love",
    "text": "In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 10,
    "theme": "love",
    "text": "Herein is love, not that we loved God, but that he loved us, and sent his Son to be the propitiation for our sins."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 16,
    "theme": "love",
    "text": "And we have known and believed the love that God hath to us. God is love; and he that dwelleth in love dwelleth in God, and God in him."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 18,
    "theme": "love",
    "text": "There is no fear in love; but perfect love casteth out fear: because fear hath torment. He that feareth is not made perfect in love."
  },
  {
    "book": "1 John",
    "chapter": 4,
    "verse": 19,
    "theme": "love",
    "text": "We love him, because he first loved us."
  },
  {
    "book": "Jude",
    "chapter": 1,
    "verse": 21,
    "theme": "love",
    "text": "Keep yourselves in the love of God, looking for the mercy of our Lord Jesus Christ unto eternal life."
  },
  {
    "book": "Revelation",
    "chapter": 1,
    "verse": 5,
    "theme": "love",
    "text": "And from Jesus Christ, who is the faithful witness, and the first begotten of the dead, and the prince of the kings of the earth. Unto him that loved us, and washed us from our sins in his own blood."
  },
  {
    "book": "Psalm",
    "chapter": 9,
    "verse": 10,
    "theme": "faith",
    "text": "And they that know thy name will put their trust in thee: for thou, LORD, hast not forsaken them that seek thee."
  },
  {
    "book": "Psalm",
    "chapter": 27,
    "verse": 1,
    "theme": "faith",
    "text": "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?"
  },
  {
    "book": "Psalm",
    "chapter": 37,
    "verse": 5,
    "theme": "faith",
    "text": "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass."
  },
  {
    "book": "Psalm",
    "chapter": 46,
    "verse": 1,
    "theme": "faith",
    "text": "God is our refuge and strength, a very present help in trouble."
  },
  {
    "book": "Psalm",
    "chapter": 91,
    "verse": 2,
    "theme": "faith",
    "text": "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust."
  },
  {
    "book": "Proverbs",
    "chapter": 16,
    "verse": 3,
    "theme": "faith",
    "text": "Commit thy works unto the LORD, and thy thoughts shall be established."
  },
  {
    "book": "Isaiah",
    "chapter": 26,
    "verse": 4,
    "theme": "faith",
    "text": "Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength."
  },
  {
    "book": "Matthew",
    "chapter": 6,
    "verse": 33,
    "theme": "faith",
    "text": "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."
  },
  {
    "book": "Mark",
    "chapter": 9,
    "verse": 24,
    "theme": "faith",
    "text": "And straightway the father of the child cried out, and said with tears, Lord, I believe; help thou mine unbelief."
  },
  {
    "book": "Luke",
    "chapter": 1,
    "verse": 37,
    "theme": "faith",
    "text": "For with God nothing shall be impossible."
  },
  {
    "book": "John",
    "chapter": 11,
    "verse": 40,
    "theme": "faith",
    "text": "Jesus saith unto him, Said I not unto thee, that, if thou wouldest believe, thou shouldest see the glory of God?"
  },
  {
    "book": "2 Timothy",
    "chapter": 1,
    "verse": 12,
    "theme": "faith",
    "text": "For the which cause I also suffer these things: nevertheless I am not ashamed: for I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
  },
  {
    "book": "Hebrews",
    "chapter": 11,
    "verse": 11,
    "theme": "faith",
    "text": "Through faith also Sara herself received strength to conceive seed, and was delivered of a child when she was past age, because she judged him faithful who had promised."
  },
  {
    "book": "Psalm",
    "chapter": 18,
    "verse": 2,
    "theme": "faith",
    "text": "The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower."
  },
  {
    "book": "2 Chronicles",
    "chapter": 20,
    "verse": 20,
    "theme": "faith",
    "text": "And they rose early in the morning, and went forth into the wilderness of Tekoa: and as they went forth, Jehoshaphat stood and said, Hear me, O Judah, and ye inhabitants of Jerusalem; Believe in the LORD your God, so shall ye be established; believe his prophets, so shall ye prosper."
  },
  {
    "book": "Psalm",
    "chapter": 9,
    "verse": 18,
    "theme": "hope",
    "text": "For the needy shall not alway be forgotten: the expectation of the poor shall not perish for ever."
  },
  {
    "book": "Psalm",
    "chapter": 25,
    "verse": 5,
    "theme": "hope",
    "text": "Lead me in thy truth, and teach me: for thou art the God of my salvation; on thee do I wait all the day."
  },
  {
    "book": "Psalm",
    "chapter": 27,
    "verse": 14,
    "theme": "hope",
    "text": "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD."
  },
  {
    "book": "Psalm",
    "chapter": 33,
    "verse": 22,
    "theme": "hope",
    "text": "Let thy mercy, O LORD, be upon us, according as we hope in thee."
  },
  {
    "book": "Psalm",
    "chapter": 62,
    "verse": 5,
    "theme": "hope",
    "text": "My soul, wait thou only upon God; for my expectation is from him."
  },
  {
    "book": "Psalm",
    "chapter": 119,
    "verse": 116,
    "theme": "hope",
    "text": "Uphold me according unto thy word, that I may live: and let me not be ashamed of my hope."
  },
  {
    "book": "Isaiah",
    "chapter": 49,
    "verse": 23,
    "theme": "hope",
    "text": "And kings shall be thy nursing fathers, and their queens thy nursing mothers: they shall bow down to thee with their face toward the earth, and lick up the dust of thy feet; and thou shalt know that I am the LORD: for they shall not be ashamed that wait for me."
  },
  {
    "book": "Romans",
    "chapter": 15,
    "verse": 4,
    "theme": "hope",
    "text": "For whatsoever things were written aforetime were written for our learning, that we through patience and comfort of the scriptures might have hope."
  },
  {
    "book": "Galatians",
    "chapter": 5,
    "verse": 5,
    "theme": "hope",
    "text": "For we through the Spirit wait for the hope of righteousness by faith."
  },
  {
    "book": "1 Thessalonians",
    "chapter": 1,
    "verse": 3,
    "theme": "hope",
    "text": "Remembering without ceasing your work of faith, and labour of love, and patience of hope in our Lord Jesus Christ, in the sight of God and our Father."
  },
  {
    "book": "2 Thessalonians",
    "chapter": 3,
    "verse": 3,
    "theme": "hope",
    "text": "But the Lord is faithful, who shall stablish you, and keep you from evil."
  },
  {
    "book": "Titus",
    "chapter": 2,
    "verse": 13,
    "theme": "hope",
    "text": "Looking for that blessed hope, and the glorious appearing of the great God and our Saviour Jesus Christ."
  },
  {
    "book": "1 Peter",
    "chapter": 1,
    "verse": 21,
    "theme": "hope",
    "text": "Who by him do believe in God, that raised him up from the dead, and gave him glory; that your faith and hope might be in God."
  },
  {
    "book": "Psalm",
    "chapter": 42,
    "verse": 11,
    "theme": "hope",
    "text": "Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him, who is the health of my countenance, and my God."
  },
  {
    "book": "Job",
    "chapter": 13,
    "verse": 15,
    "theme": "hope",
    "text": "Though he slay me, yet will I trust in him: but I will maintain mine own ways before him."
  },
  {
    "book": "Ruth",
    "chapter": 1,
    "verse": 16,
    "theme": "love",
    "text": "And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God."
  },
  {
    "book": "Psalm",
    "chapter": 145,
    "verse": 8,
    "theme": "love",
    "text": "The LORD is gracious, and full of compassion; slow to anger, and of great mercy."
  },
  {
    "book": "Proverbs",
    "chapter": 8,
    "verse": 17,
    "theme": "love",
    "text": "I love them that love me; and those that seek me early shall find me."
  },
  {
    "book": "Proverbs",
    "chapter": 15,
    "verse": 17,
    "theme": "love",
    "text": "Better is a dinner of herbs where love is, than a stalled ox and hatred therewith."
  },
  {
    "book": "Micah",
    "chapter": 6,
    "verse": 8,
    "theme": "love",
    "text": "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"
  },
  {
    "book": "Matthew",
    "chapter": 19,
    "verse": 19,
    "theme": "love",
    "text": "Honour thy father and thy mother: and, Thou shalt love thy neighbour as thyself."
  },
  {
    "book": "Mark",
    "chapter": 10,
    "verse": 21,
    "theme": "love",
    "text": "Then Jesus beholding him loved him, and said unto him, One thing thou lackest: go thy way, sell whatsoever thou hast, and give to the poor, and thou shalt have treasure in heaven: and come, take up the cross, and follow me."
  },
  {
    "book": "John",
    "chapter": 14,
    "verse": 15,
    "theme": "love",
    "text": "If ye love me, keep my commandments."
  },
  {
    "book": "John",
    "chapter": 14,
    "verse": 21,
    "theme": "love",
    "text": "He that hath my commandments, and keepeth them, he it is that loveth me: and he that loveth me shall be loved of my Father, and I will love him, and will manifest myself to him."
  },
  {
    "book": "John",
    "chapter": 15,
    "verse": 9,
    "theme": "love",
    "text": "As the Father hath loved me, so have I loved you: continue ye in my love."
  },
  {
    "book": "John",
    "chapter": 17,
    "verse": 26,
    "theme": "love",
    "text": "And I have declared unto them thy name, and will declare it: that the love wherewith thou hast loved me may be in them, and I in them."
  },
  {
    "book": "Romans",
    "chapter": 12,
    "verse": 10,
    "theme": "love",
    "text": "Be kindly affectioned one to another with brotherly love; in honour preferring one another."
  },
  {
    "book": "2 Corinthians",
    "chapter": 8,
    "verse": 9,
    "theme": "love",
    "text": "For ye know the grace of our Lord Jesus Christ, that, though he was rich, yet for your sakes he became poor, that ye through his poverty might be rich."
  },
  {
    "book": "Galatians",
    "chapter": 5,
    "verse": 13,
    "theme": "love",
    "text": "For, brethren, ye have been called unto liberty; only use not liberty for an occasion to the flesh, but by love serve one another."
  },
  {
    "book": "Colossians",
    "chapter": 3,
    "verse": 12,
    "theme": "love",
    "text": "Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering."
  }
];

/* ===========================================================
   VERSE BANNER — "Spirit" ribbon shown at the top of the app,
   above every tab. Alternates Love → Hope → Faith, one verse
   every 10 seconds, cycling through this device's KJV pool
   and looping back to the start once each theme is exhausted.
   =========================================================== */

const VerseBanner = (function(){

  const ROTATION = ['love','hope','faith'];
  const INTERVAL_MS = 10000;

  function shuffled(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  const pools = {
    love: shuffled(VERSES.filter(v=>v.theme==='love')),
    hope: shuffled(VERSES.filter(v=>v.theme==='hope')),
    faith: shuffled(VERSES.filter(v=>v.theme==='faith'))
  };
  const pointers = { love:0, hope:0, faith:0 };
  let rotIdx = 0;
  let el = null;
  let timer = null;
  let collapsed = false;

  const THEME_LABEL = { love:'Love', hope:'Hope', faith:'Faith' };
  const THEME_GLYPH = { love:'♥', hope:'⚓', faith:'✦' };

  function nextVerse(){
    const theme = ROTATION[rotIdx % ROTATION.length];
    rotIdx++;
    const pool = pools[theme];
    if(!pool.length) return null;
    const i = pointers[theme] % pool.length;
    pointers[theme] = i+1; // loops back to 0 naturally via modulo, i.e. "loops up"
    return pool[i];
  }

  function init(container){
    el = container;
    el.innerHTML = `
      <div class="vb-frame theme-love">
        <button class="vb-toggle" title="Collapse">⌃</button>
        <div class="vb-corner tl"></div><div class="vb-corner tr"></div>
        <div class="vb-corner bl"></div><div class="vb-corner br"></div>
        <div class="vb-top">
          <span class="vb-pill"><span class="vb-glyph">✦</span><span class="vb-theme-label">Faith</span></span>
          <span class="vb-kjv">SPIRIT · KJV</span>
        </div>
        <div class="vb-body">
          <blockquote class="vb-text"></blockquote>
          <cite class="vb-ref"></cite>
        </div>
        <div class="vb-dots">
          <span class="vb-dot" data-t="love"></span>
          <span class="vb-dot" data-t="hope"></span>
          <span class="vb-dot" data-t="faith"></span>
        </div>
      </div>
    `;
    el.querySelector('.vb-toggle').onclick = toggleCollapse;
    el.querySelector('.vb-frame').onclick = (e)=>{
      if(e.target.closest('.vb-toggle')) return;
      advance(true);
    };
    advance(false);
  }

  function toggleCollapse(){
    collapsed = !collapsed;
    el.querySelector('.vb-frame').classList.toggle('collapsed', collapsed);
    el.querySelector('.vb-toggle').textContent = collapsed ? '⌄' : '⌃';
    el.querySelector('.vb-toggle').title = collapsed ? 'Expand' : 'Collapse';
  }

  function advance(userTriggered){
    const v = nextVerse();
    if(!v) return;
    const frame = el.querySelector('.vb-frame');
    const body = el.querySelector('.vb-body');
    const pill = el.querySelector('.vb-pill');
    frame.classList.remove('theme-love','theme-hope','theme-faith');
    frame.classList.add('theme-'+v.theme);
    body.classList.add('fade-out');
    setTimeout(()=>{
      el.querySelector('.vb-text').textContent = '“'+v.text+'”';
      el.querySelector('.vb-ref').textContent = `${v.book} ${v.chapter}:${v.verse}`;
      el.querySelector('.vb-theme-label').textContent = THEME_LABEL[v.theme];
      el.querySelector('.vb-glyph').textContent = THEME_GLYPH[v.theme];
      el.querySelectorAll('.vb-dot').forEach(d=> d.classList.toggle('active', d.dataset.t===v.theme));
      body.classList.remove('fade-out');
    }, userTriggered ? 80 : 220);
    if(userTriggered) restart();
  }

  function start(){
    if(timer) clearInterval(timer);
    timer = setInterval(()=>advance(false), INTERVAL_MS);
  }
  function restart(){ start(); }
  function stop(){ if(timer) clearInterval(timer); timer=null; }

  return { init, start, stop };
})();
window.VerseBanner = VerseBanner;
