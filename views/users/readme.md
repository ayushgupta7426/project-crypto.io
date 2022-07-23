 <% arr.forEach((element,index)=> { %>
                        <tr>
                          <th scope="row"><a href="#">#2457</a></th>
                          <td><%= element.companyName %></td>
                          <td><%= element.numberOfCoins * priceVal%></td>
                          <td>
                            <span class="badge bg-success">Approved</span>
                          </td>
                        </tr>
                        <% }) %>