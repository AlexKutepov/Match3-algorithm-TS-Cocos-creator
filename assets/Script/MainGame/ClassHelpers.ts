export class CheckerBoolean {

  public static checkTwoBoolean(one, two) {
    return one & two;
  }

  public static checkTrheeBoolean(one, two, trhee) {
    return one & two & trhee;
  }

  public static EqualsTwoObj(one, two) {
    return one === two;
  }

  public static EqualsTrheeObj(one, two, trhee) {
    if (one === two && two === trhee) return true;
    return false;
  }
}