import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import { useHistory } from "react-router";

import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";

const AccountUpdatePage = () => {
  const history = useHistory();

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <a className={cx(classes["header__link"], classes["link"])} href="#">
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                <span className={classes["link__text"]}>Back</span>
              </a>
            </div>
          </div>
        </header>
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["account-changes"]}>
              <div className={classes["account-changes__title"]}>Edit account</div>
              <div className={classes["account-changes__container"]}>
                <div className={cx(classes["account-changes__item"], classes["account-changes-item"])}>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Title / Gender</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select>
                        <option value="Ms">Ms</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>First Name</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" value="John Erald" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Middle Name</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Last Name</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" value="Calle" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Civil Status</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select id="civilStatus" name="civilStatus">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Country</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select id="nationality" name="nationality">
                        <option value="3">Afghanistan</option>
                        <option value="2">Albania</option>
                        <option value="173">Algeria</option>
                        <option value="228">American Samoa</option>
                        <option value="158">Andorra</option>
                        <option value="229">Angola</option>
                        <option value="230">Anguilla</option>
                        <option value="231">Antarctica</option>
                        <option value="232">Antigua and Barbuda</option>
                        <option value="4">Argentina</option>
                        <option value="5">Armenia</option>
                        <option value="6">Aruba</option>
                        <option value="7">Australia</option>
                        <option value="8">Austria</option>
                        <option value="9">Azerbaijan</option>
                        <option value="10">Bahamas</option>
                        <option value="11">Bahrain</option>
                        <option value="233">Bangladesh</option>
                        <option value="16">Barbados</option>
                        <option value="12">Belarus</option>
                        <option value="13">Belgium</option>
                        <option value="235">Belize</option>
                        <option value="236">Benin</option>
                        <option value="237">Bermuda</option>
                        <option value="238">Bhutan</option>
                        <option value="159">Bolivia</option>
                        <option value="239">Bosnia and Herzegowina</option>
                        <option value="14">Botswana</option>
                        <option value="240">Bouvet Island</option>
                        <option value="15">Brazil</option>
                        <option value="241">British Indian Ocean Territory</option>
                        <option value="242">Brunei</option>
                        <option value="17">Bulgaria</option>
                        <option value="243">Burkina Faso</option>
                        <option value="244">Burundi</option>
                        <option value="170">Cambodia</option>
                        <option value="245">Cameroon</option>
                        <option value="18">Canada</option>
                        <option value="246">Cape Verde</option>
                        <option value="247">Cayman Islands</option>
                        <option value="248">Central African Republic</option>
                        <option value="249">Chad</option>
                        <option value="154">Chile</option>
                        <option value="20">China</option>
                        <option value="251">Christmas Island</option>
                        <option value="252">Cocos (Keeling) Islands</option>
                        <option value="161">Colombia</option>
                        <option value="253">Comoros</option>
                        <option value="255">Congo, Democratic Republic of the</option>
                        <option value="254">Congo, Republic of</option>
                        <option value="256">Cook Islands</option>
                        <option value="160">Costa Rica</option>
                        <option value="21">Croatia (Hrvatska)</option>
                        <option value="257">Cuba</option>
                        <option value="22">Cyprus</option>
                        <option value="23">Czech Republic</option>
                        <option value="24">Denmark</option>
                        <option value="259">Djibouti</option>
                        <option value="25">Dominica</option>
                        <option value="260">Dominican Republic</option>
                        <option value="162">Ecuador</option>
                        <option value="26">Egypt</option>
                        <option value="27">El Salvador</option>
                        <option value="1661">England</option>
                        <option value="28">Equatorial Guinea</option>
                        <option value="262">Eritrea</option>
                        <option value="29">Estonia</option>
                        <option value="263">Ethiopia</option>
                        <option value="264">Falkland Islands (Malvinas)</option>
                        <option value="265">Faroe Islands</option>
                        <option value="266">Fiji</option>
                        <option value="30">Finland</option>
                        <option value="31">France</option>
                        <option value="267">French Guiana</option>
                        <option value="268">French Polynesia</option>
                        <option value="269">French Southern and Antarctic Territories</option>
                        <option value="270">Gabon</option>
                        <option value="271">Gambia</option>
                        <option value="32">Georgia</option>
                        <option value="33">Germany</option>
                        <option value="34">Ghana</option>
                        <option value="35">Gibraltar</option>
                        <option value="37">Greece</option>
                        <option value="38">Greenland</option>
                        <option value="36">Grenada</option>
                        <option value="272">Guadeloupe</option>
                        <option value="273">Guam</option>
                        <option value="274">Guatemala</option>
                        <option value="102">Guernsey</option>
                        <option value="275">Guinea</option>
                        <option value="276">Guinea-Bissau</option>
                        <option value="277">Guyana</option>
                        <option value="278">Haiti</option>
                        <option value="279">Heard and McDonald Islands</option>
                        <option value="280">Holy See (Vatican City State)</option>
                        <option value="281">Honduras</option>
                        <option value="39">Hong Kong</option>
                        <option value="40">Hungary</option>
                        <option value="41">Iceland</option>
                        <option value="42">India</option>
                        <option value="43">Indonesia</option>
                        <option value="45">Iran</option>
                        <option value="172">Iraq</option>
                        <option value="44">Ireland</option>
                        <option value="103">Isle of Man</option>
                        <option value="46">Israel</option>
                        <option value="47">Italy</option>
                        <option value="282">Ivory Coast</option>
                        <option value="283">Jamaica</option>
                        <option value="48">Japan</option>
                        <option value="101">Jersey</option>
                        <option value="284">Jordan</option>
                        <option value="174">Kazakhstan</option>
                        <option value="285">Kenya</option>
                        <option value="286">Kiribati</option>
                        <option value="67">Korea, Democratic People's Republic of</option>
                        <option value="82">Korea, Republic of</option>
                        <option value="49">Kuwait</option>
                        <option value="167">Kyrgyzstan</option>
                        <option value="288">Laos</option>
                        <option value="50">Latvia</option>
                        <option value="289">Lebanon</option>
                        <option value="290">Lesotho</option>
                        <option value="291">Liberia</option>
                        <option value="292">Libya</option>
                        <option value="51">Liechtenstein</option>
                        <option value="52">Lithuania</option>
                        <option value="53">Luxembourg</option>
                        <option value="54">Macau</option>
                        <option value="55">Macedonia FYR</option>
                        <option value="293">Madagascar</option>
                        <option value="294">Malawi</option>
                        <option value="56">Malaysia</option>
                        <option value="295">Maldives</option>
                        <option value="296">Mali</option>
                        <option value="57">Malta</option>
                        <option value="297">Marshall Islands</option>
                        <option value="298">Martinique</option>
                        <option value="299">Mauritania</option>
                        <option value="58">Mauritius</option>
                        <option value="300">Mayotte</option>
                        <option value="59">Mexico</option>
                        <option value="301">Micronesia, Federated States of</option>
                        <option value="60">Moldova</option>
                        <option value="61">Monaco</option>
                        <option value="302">Mongolia</option>
                        <option value="352">Montenegro</option>
                        <option value="62">Montserrat</option>
                        <option value="171">Morocco</option>
                        <option value="303">Mozambique</option>
                        <option value="304">Myanmar (Burma)</option>
                        <option value="63">Namibia</option>
                        <option value="305">Nauru</option>
                        <option value="64">Nepal</option>
                        <option value="65">Netherlands</option>
                        <option value="306">Netherlands Antilles</option>
                        <option value="307">New Caledonia</option>
                        <option value="66">New Zealand</option>
                        <option value="308">Nicaragua</option>
                        <option value="309">Niger</option>
                        <option value="153">Nigeria</option>
                        <option value="310">Niue</option>
                        <option value="311">Norfolk Island</option>
                        <option value="1445">Northern Ireland</option>
                        <option value="312">Northern Mariana Islands</option>
                        <option value="68">Norway</option>
                        <option value="85">Oman</option>
                        <option value="155">Pakistan</option>
                        <option value="313">Palau</option>
                        <option value="163">Panama</option>
                        <option value="157">Papua New Guinea</option>
                        <option value="164">Paraguay</option>
                        <option value="165">Peru</option>
                        <option selected="selected" value="69">
                          Philippines
                        </option>
                        <option value="314">Pitcairn Island</option>
                        <option value="70">Poland</option>
                        <option value="71">Portugal</option>
                        <option value="315">Puerto Rico</option>
                        <option value="72">Qatar</option>
                        <option value="73">Romania</option>
                        <option value="74">Russia</option>
                        <option value="317">Rwanda</option>
                        <option value="316">Réunion</option>
                        <option value="318">Saint Helena</option>
                        <option value="319">Saint Kitts and Nevis</option>
                        <option value="320">Saint Lucia</option>
                        <option value="321">Saint Pierre and Miquelon</option>
                        <option value="322">Saint Vincent and the Grenadines</option>
                        <option value="323">Samoa</option>
                        <option value="75">San Marino</option>
                        <option value="324">Sao Tome and Principe</option>
                        <option value="76">Saudi Arabia</option>
                        <option value="1370">Scotland</option>
                        <option value="77">Senegal</option>
                        <option value="100">Serbia</option>
                        <option value="325">Seychelles</option>
                        <option value="326">Sierra Leone</option>
                        <option value="78">Singapore</option>
                        <option value="79">Slovakia</option>
                        <option value="80">Slovenia</option>
                        <option value="327">Solomon Islands</option>
                        <option value="328">Somalia</option>
                        <option value="81">South Africa</option>
                        <option value="329">South Georgia and the South Sandwich Islands</option>
                        <option value="83">Spain</option>
                        <option value="84">Sri Lanka</option>
                        <option value="330">Sudan</option>
                        <option value="331">Suriname</option>
                        <option value="332">Svalbard and Jan Mayen Islands</option>
                        <option value="333">Swaziland</option>
                        <option value="86">Sweden</option>
                        <option value="87">Switzerland</option>
                        <option value="334">Syrian Arab Republic</option>
                        <option value="335">Taiwan, Province of China</option>
                        <option value="168">Tajikistan</option>
                        <option value="336">Tanzania, United Republic of</option>
                        <option value="88">Thailand</option>
                        <option value="261">Timor-Leste</option>
                        <option value="337">Togo</option>
                        <option value="338">Tokelau</option>
                        <option value="339">Tonga</option>
                        <option value="340">Trinidad and Tobago</option>
                        <option value="341">Tunisia</option>
                        <option value="89">Turkey</option>
                        <option value="342">Turkmenistan</option>
                        <option value="343">Turks and Caicos Islands</option>
                        <option value="344">Tuvalu</option>
                        <option value="91">USA</option>
                        <option value="345">Uganda</option>
                        <option value="92">Ukraine</option>
                        <option value="93">United Arab Emirates</option>
                        <option value="1">United Kingdom</option>
                        <option value="94">United States Minor Outlying Islands</option>
                        <option value="95">Uruguay</option>
                        <option value="169">Uzbekistan</option>
                        <option value="346">Vanautu</option>
                        <option value="96">Venezuela</option>
                        <option value="97">Vietnam</option>
                        <option value="347">Virgin Islands (British)</option>
                        <option value="348">Virgin Islands (US)</option>
                        <option value="1020">Wales</option>
                        <option value="98">Wallis and Futuna Islands</option>
                        <option value="99">Western Sahara</option>
                        <option value="349">Yemen</option>
                        <option value="350">Zambia</option>
                        <option value="156">Zimbabwe</option>
                        <option value="351">Åland Islands</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Date of Birth (MM/DD/YYYY)</div>
                    <div
                      className={cx(classes["account-changes-item__data"], classes["account-changes-item__data_birth"])}
                    >
                      <select disabled="disabled" name="month">
                        <option selected="">1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                      </select>
                      <select disabled="disabled" name="date">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option selected="">5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                        <option>22</option>
                        <option>23</option>
                        <option>24</option>
                        <option>25</option>
                        <option>26</option>
                        <option>27</option>
                        <option>28</option>
                        <option>29</option>
                        <option>30</option>
                        <option>31</option>
                      </select>
                      <select disabled="disabled" name="year">
                        <option>1910</option>
                        <option>1911</option>
                        <option>1912</option>
                        <option>1913</option>
                        <option>1914</option>
                        <option>1915</option>
                        <option>1916</option>
                        <option>1917</option>
                        <option>1918</option>
                        <option>1919</option>
                        <option>1920</option>
                        <option>1921</option>
                        <option>1922</option>
                        <option>1923</option>
                        <option>1924</option>
                        <option>1925</option>
                        <option>1926</option>
                        <option>1927</option>
                        <option>1928</option>
                        <option>1929</option>
                        <option>1930</option>
                        <option>1931</option>
                        <option>1932</option>
                        <option>1933</option>
                        <option>1934</option>
                        <option>1935</option>
                        <option>1936</option>
                        <option>1937</option>
                        <option>1938</option>
                        <option>1939</option>
                        <option>1940</option>
                        <option>1941</option>
                        <option>1942</option>
                        <option>1943</option>
                        <option>1944</option>
                        <option>1945</option>
                        <option>1946</option>
                        <option>1947</option>
                        <option>1948</option>
                        <option>1949</option>
                        <option>1950</option>
                        <option>1951</option>
                        <option>1952</option>
                        <option>1953</option>
                        <option>1954</option>
                        <option>1955</option>
                        <option>1956</option>
                        <option>1957</option>
                        <option>1958</option>
                        <option>1959</option>
                        <option>1960</option>
                        <option>1961</option>
                        <option>1962</option>
                        <option>1963</option>
                        <option>1964</option>
                        <option>1965</option>
                        <option>1966</option>
                        <option>1967</option>
                        <option>1968</option>
                        <option>1969</option>
                        <option>1970</option>
                        <option>1971</option>
                        <option>1972</option>
                        <option>1973</option>
                        <option>1974</option>
                        <option>1975</option>
                        <option>1976</option>
                        <option>1977</option>
                        <option>1978</option>
                        <option>1979</option>
                        <option>1980</option>
                        <option>1981</option>
                        <option>1982</option>
                        <option>1983</option>
                        <option selected="">1984</option>
                        <option>1985</option>
                        <option>1986</option>
                        <option>1987</option>
                        <option>1988</option>
                        <option>1989</option>
                        <option>1990</option>
                        <option>1991</option>
                        <option>1992</option>
                        <option>1993</option>
                        <option>1994</option>
                        <option>1995</option>
                        <option>1996</option>
                        <option>1997</option>
                        <option>1998</option>
                        <option>1999</option>
                        <option>2000</option>
                      </select>
                      <div className={classes["account-changes-item__age"]}>Age: 37</div>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Address</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Postcode</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Mobile Number</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" value="+63 09235270027" />
                    </div>
                  </div>
                </div>
                <div className={cx(classes["account-changes__item"], classes["account-changes-item"])}>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Username</div>
                    <div className={cx(classes["account-changes-item__data"], classes["disabled"])}>
                      <input type="text" value="JOHNNIE" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Email Address</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input disabled type="email" value="wysiwyg614@yahoo.com" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>ID Type</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select id="idType" name="idType">
                        <option disabled className={classes["default"]}>
                          Select type of ID
                        </option>
                        <option value="2">Alien/Immigrant Certificate of Registration</option>
                        <option value="0">Driver's License</option>
                        <option value="14">Firearms License issued by PNP</option>
                        <option value="15">Integrated Bar of the Philippines ID</option>
                        <option value="16">National Bureau of Investigation (NBI) Clearance</option>
                        <option value="17">Overseas Filipino Worker (OFW) ID</option>
                        <option value="18">Overseas Workers Welfare Administration (OWWA) ID</option>
                        <option value="3">Passport including foreign issued</option>
                        <option value="19">PhilHealth ID</option>
                        <option value="20">Police Clearance Certificate</option>
                        <option value="4">Postal ID</option>
                        <option value="5">Professional Regulations Commission (PRC) ID</option>
                        <option value="21">Seaman's Book</option>
                        <option value="6">Senior Citizen Card</option>
                        <option value="7">Social Security System (SSS) Card</option>
                        <option value="8">Tax Identification (TIN)</option>
                        <option value="9">Unified Multi-Purpose ID (UMID)</option>
                        <option value="10">Voter's ID</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>ID Number</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" value="Calle" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>ID Type 2</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select id="idType2" name="idType2">
                        <option className={classes["default"]} disabled="disabled" value="">
                          Select type of ID
                        </option>
                        <option value="2">Alien/Immigrant Certificate of Registration</option>
                        <option value="0">Driver's License</option>
                        <option value="14">Firearms License issued by PNP</option>
                        <option value="15">Integrated Bar of the Philippines ID</option>
                        <option value="16">National Bureau of Investigation (NBI) Clearance</option>
                        <option value="17">Overseas Filipino Worker (OFW) ID</option>
                        <option value="18">Overseas Workers Welfare Administration (OWWA) ID</option>
                        <option value="3">Passport including foreign issued</option>
                        <option value="19">PhilHealth ID</option>
                        <option value="20">Police Clearance Certificate</option>
                        <option value="4">Postal ID</option>
                        <option value="5">Professional Regulations Commission (PRC) ID</option>
                        <option value="21">Seaman's Book</option>
                        <option value="6">Senior Citizen Card</option>
                        <option value="7">Social Security System (SSS) Card</option>
                        <option value="8">Tax Identification (TIN)</option>
                        <option value="9">Unified Multi-Purpose ID (UMID)</option>
                        <option value="10">Voter's ID</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>ID Number 2</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="text" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Security Question 1</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select
                        className={classes["securityquestion-group"]}
                        id="securityQuestionId1"
                        name="securityQuestionId1"
                      >
                        <option disabled="disabled" value="1">
                          Mothers maiden name
                        </option>
                        <option selected="selected" value="2">
                          Favourite Team
                        </option>
                        <option value="3">Place of Birth</option>
                        <option value="4">Pet Name</option>
                        <option value="5">Favourite Colour</option>
                        <option value="6">Date of Birth</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Security Answer 1</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="password" value="Arrellana" />
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Security Question 1</div>
                    <div className={classes["account-changes-item__data"]}>
                      <select
                        className={classes["securityquestion-group"]}
                        id="securityQuestionId2"
                        name="securityQuestionId2"
                      >
                        <option value="1">Mothers maiden name</option>
                        <option disabled="disabled" value="2">
                          Favourite Team
                        </option>
                        <option value="3">Place of Birth</option>
                        <option value="4">Pet Name</option>
                        <option value="5">Favourite Colour</option>
                        <option value="6">Date of Birth</option>
                      </select>
                    </div>
                  </div>
                  <div className={classes["account-changes-item__box"]}>
                    <div className={classes["account-changes-item__label"]}>Security Answer 2</div>
                    <div className={classes["account-changes-item__data"]}>
                      <input type="password" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes["account-changes__buttons"]}>
                <div className={classes["account-changes__button"]}>Cancel</div>
                <div className={classes["account-changes__button"]}>update Account</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(AccountUpdatePage));
