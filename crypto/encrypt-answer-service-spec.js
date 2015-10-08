describe("EncryptAnswerService tests", function() {
  var group = {
    "g":"27257469383433468307851821232336029008797963446516266868278476598991619799718416119050669032044861635977216445034054414149795443466616532657735624478207460577590891079795564114912418442396707864995938563067755479563850474870766067031326511471051504594777928264027177308453446787478587442663554203039337902473879502917292403539820877956251471612701203572143972352943753791062696757791667318486190154610777475721752749567975013100844032853600120195534259802017090281900264646220781224136443700521419393245058421718455034330177739612895494553069450438317893406027741045575821283411891535713793639123109933196544017309147",
    "p":"49585549017473769285737299189965659293354088286913371933804180900778253856217662802521113040825270214021114944067918826365443480688403488878664971371922806487664111406970012663245195033428706668950006712214428830267861043863002671272535727084730103068500694744742135062909134544770371782327891513041774499809308517270708450370367766144873413397605830861330660620343634294061022593630276805276836395304145517051831281606133359766619313659042006635890778628844508225693978825158392000638704210656475473454575867531351247745913531003971176340768343624926105786111680264179067961026247115541456982560249992525766217307447",
    "q":"24792774508736884642868649594982829646677044143456685966902090450389126928108831401260556520412635107010557472033959413182721740344201744439332485685961403243832055703485006331622597516714353334475003356107214415133930521931501335636267863542365051534250347372371067531454567272385185891163945756520887249904654258635354225185183883072436706698802915430665330310171817147030511296815138402638418197652072758525915640803066679883309656829521003317945389314422254112846989412579196000319352105328237736727287933765675623872956765501985588170384171812463052893055840132089533980513123557770728491280124996262883108653723"
  };

  var EncryptAnswerService;
  var ElGamal;
  var BigInt;
  var stringify;

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_EncryptAnswerService_, _ElGamalService_, _BigIntService_, _DeterministicJsonStringifyService_) {
    EncryptAnswerService = _EncryptAnswerService_;
    ElGamal = _ElGamalService_;
    BigInt = _BigIntService_;
    stringify = _DeterministicJsonStringifyService_;
  }));

  it("should encrypt and prove plaintext knowledge", inject(function() {
    // random plaintext in arbitrary range
    var plaintext = Math.floor(Math.random() * 10000) + 1;
    console.log(plaintext);

    var params = new ElGamal.Params(
      BigInt.fromInt(group.p),
      BigInt.fromInt(group.q),
      BigInt.fromInt(group.g));
    // generate private and public keys
    var secret = params.generate();
    // encrypt
    var encryptor = EncryptAnswerService(secret.pk.toJSONObject());
    var encrypted = encryptor.encryptAnswer(plaintext);

    // verify plaintext proof
    expect(encryptor.verifyPlaintextProof(encrypted)).toBe(true);

    // verify decryption works
    var ctext = new ElGamal.Ciphertext(
      BigInt.fromInt(encrypted.alpha),
      BigInt.fromInt(encrypted.beta),
      secret.pk);
    var decrypted = secret.decryptAndProve(
      ctext,
      ElGamal.fiatshamir_dlog_challenge_generator);
    var plaintextDecrypted = decrypted.plaintext.getPlaintext().intValue();

    expect(plaintextDecrypted).toBe(plaintext);
    console.log(plaintextDecrypted);
  }));

  it("should encrypt and prove knowledge, with given pubkey", inject(function (){
    var pubkey = {
      "y":"9267959900687597160746074643729934857841198969021980876068002060220602759527328533647175257313381164854420254149677218896232268568570733755307271694359348266941702343277973832308703389291190679634220764783536337019012562580218818396298483940932931027417186566941173055388683173894471639879078838281758381965406225983012056060052802897439630276494541453496407716664005385770540295468027512544576240148635705927178700385234474792943684596349069778834084422799614980047979134434012297230117346318686335716367636978288382955351431559184099910959364922854379540127324113150138959782731420861666435877461272249942053036514",
      "g":"27257469383433468307851821232336029008797963446516266868278476598991619799718416119050669032044861635977216445034054414149795443466616532657735624478207460577590891079795564114912418442396707864995938563067755479563850474870766067031326511471051504594777928264027177308453446787478587442663554203039337902473879502917292403539820877956251471612701203572143972352943753791062696757791667318486190154610777475721752749567975013100844032853600120195534259802017090281900264646220781224136443700521419393245058421718455034330177739612895494553069450438317893406027741045575821283411891535713793639123109933196544017309147",
      "q":"24792774508736884642868649594982829646677044143456685966902090450389126928108831401260556520412635107010557472033959413182721740344201744439332485685961403243832055703485006331622597516714353334475003356107214415133930521931501335636267863542365051534250347372371067531454567272385185891163945756520887249904654258635354225185183883072436706698802915430665330310171817147030511296815138402638418197652072758525915640803066679883309656829521003317945389314422254112846989412579196000319352105328237736727287933765675623872956765501985588170384171812463052893055840132089533980513123557770728491280124996262883108653723",
      "p":"49585549017473769285737299189965659293354088286913371933804180900778253856217662802521113040825270214021114944067918826365443480688403488878664971371922806487664111406970012663245195033428706668950006712214428830267861043863002671272535727084730103068500694744742135062909134544770371782327891513041774499809308517270708450370367766144873413397605830861330660620343634294061022593630276805276836395304145517051831281606133359766619313659042006635890778628844508225693978825158392000638704210656475473454575867531351247745913531003971176340768343624926105786111680264179067961026247115541456982560249992525766217307447"
    };
    var encryptedAnswer = {"alpha": "38570684494326853218398025404082176317643243335357529427962001872315432024097420420863712028800091713754868331650830805460076403704368883622934975901552569749294957260038559168132188786910532977452078031167410375492385728731873891611761752992444476170831988643455219780209852725734322554009689931819965647106301216264871179314757344583923384502360149192350698477709163509930459018067141440744260875363713631469337057823680162579670166232045794976970668341830339410920193068219112842527258483572839864400977380367635414634327386637171700084696839107504924155291392239607528823486715640525525431062541570884383090448561", "beta": "2296240450636345095715389900198180399434476191419075956428016806917912743269860663960151331189623787870967535232121926189758007955888835727483247900036631216409906546645709106870143889918931811263089855258669763568371938062279603548700404927830552097072635757498939266743665619974308453836737415012264461625261804571528037757933479607698548465045846277714656531593081269728883051590659477857607203320382628338551509160716615964540847378216572435070253578826667750427066343615889903571884999693319426635919696067977447835375261372254653026067114149568106019884756666066624253476073901055657992937633315344542555207813", "challenge": "45302104956496588306071819517860409449445305204450028740369909281057383252236", "commitment": "34089154936126150610944190391666197510644983070372052165526165336813787757557940925631741368676023754189899291014467759296801160490447079266911423575725487540050163997085688070569109290057153546456813172795423943080712002736379929793294601598987761142789368107898889122517417495164863152811006560622368325628549584435573356503842513514924976336671963964469083118460789979449466370342981062954811258059588340895747366070326342996084010359578305654909019987460883737863514804714485881533946767436721591509062984963565707008404425323149224843640005589320184119575218764094713597933336667740981535586387867348382033156332", "response": "22075851651615656971313715866511931105943045562044112355268477902387106030970035419", "plaintext": "1019951", "randomness": "487303"};

    var randomness2 = 5675911;

    // encrypt
    var encryptor = EncryptAnswerService(pubkey);
    var encrypted = encryptor.encryptAnswer(
      parseInt(encryptedAnswer.plaintext),
      parseInt(encryptedAnswer.randomness),
      randomness2);

    // verify encrypted vote is bit by bit exact
    expect(stringify(encrypted)).toBe(stringify(encryptedAnswer));

    // verify plaintext proof
    expect(encryptor.verifyPlaintextProof(encrypted)).toBe(true);
  }));
});